"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@/context/UserProvider";
import { toast } from "react-toastify";
import { ALADHAN_API_BASE_URL } from "@/lib/api/config";
import { Volume2, Square } from "lucide-react";

const PrayerTrackerContext = createContext(null);

export function usePrayerTracker() {
  return useContext(PrayerTrackerContext);
}

const LEGACY_STORAGE_KEY_SETTINGS = "quran_namaz_reminder_settings";
const LEGACY_STORAGE_KEY_LOGS = "quran_namaz_tracker_logs";
const NOTIFIED_MAP_KEY = "quran_namaz_notified_map";
const AZAN_VOICE_KEY = "quran_namaz_azan_voice";

export function PrayerTrackerProvider({ children }) {
  const { user, session } = useUser();

  // 1. Reminder preferences state
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [prayerReminders, setPrayerReminders] = useState({
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  });
  const [reminderSound, setReminderSound] = useState(true);
  const [azanVoice, setAzanVoice] = useState("makkah"); // 'makkah', 'madinah', 'fajr', 'chime'

  // 2. Azan Audio Playback state
  const [isAzanPlaying, setIsAzanPlaying] = useState(false);
  const [activeAzanPrayer, setActiveAzanPrayer] = useState("");
  const activeAudioRef = useRef(null);

  // 3. Prayer completion logs state
  const [completedLogs, setCompletedLogs] = useState({});
  const [isSyncedWithAccount, setIsSyncedWithAccount] = useState(false);

  // 4. Service worker registration & global timings state
  const [swRegistration, setSwRegistration] = useState(null);
  const [globalTimings, setGlobalTimings] = useState(null);

  // 5. Track last notified prayer to avoid duplicate alerts
  const [notifiedMap, setNotifiedMap] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(NOTIFIED_MAP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const todayStr = new Date().toISOString().split("T")[0];
        const filtered = {};
        Object.keys(parsed).forEach((k) => {
          if (k.startsWith(todayStr)) {
            filtered[k] = parsed[k];
          }
        });
        return filtered;
      }
    } catch (e) {
      console.error("Failed to load notifiedMap from localStorage:", e);
    }
    return {};
  });

  // Register Service Worker
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setSwRegistration(reg);
        })
        .catch((err) => {
          console.error("ServiceWorker registration failed:", err);
        });
    }
  }, []);

  // Helper to load settings from storage
  const loadLocalSettings = useCallback((userId) => {
    if (typeof window === "undefined") return;
    try {
      const suffix = userId ? `_${userId}` : "_guest";
      const settingsKey = `quran_namaz_reminder_settings${suffix}`;
      let savedSettings = localStorage.getItem(settingsKey);
      if (!savedSettings && !userId) {
        savedSettings = localStorage.getItem(LEGACY_STORAGE_KEY_SETTINGS);
      }
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.remindersEnabled === "boolean") setRemindersEnabled(parsed.remindersEnabled);
        if (parsed.prayerReminders) setPrayerReminders(parsed.prayerReminders);
        if (typeof parsed.reminderSound === "boolean") setReminderSound(parsed.reminderSound);
      }

      const savedVoice = localStorage.getItem(AZAN_VOICE_KEY);
      if (savedVoice) {
        setAzanVoice(savedVoice);
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage:", e);
    }
  }, []);

  // Helper to save settings to storage
  const saveSettings = useCallback((newRemindersEnabled, newPrayerReminders, newSound, newVoice) => {
    if (typeof window === "undefined") return;
    try {
      const suffix = user?.id ? `_${user.id}` : "_guest";
      const settingsKey = `quran_namaz_reminder_settings${suffix}`;
      const payload = JSON.stringify({
        remindersEnabled: newRemindersEnabled,
        prayerReminders: newPrayerReminders,
        reminderSound: newSound,
      });
      localStorage.setItem(settingsKey, payload);
      if (newVoice) {
        localStorage.setItem(AZAN_VOICE_KEY, newVoice);
      }
    } catch (e) {
      console.error("Failed to save reminder settings:", e);
    }
  }, [user?.id]);

  const changeAzanVoice = (voice) => {
    setAzanVoice(voice);
    saveSettings(remindersEnabled, prayerReminders, reminderSound, voice);
  };

  // Stop currently playing Azan audio
  const stopAzanSound = useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    setIsAzanPlaying(false);
    setActiveAzanPrayer("");
  }, []);

  // Synthesized soft chime fallback
  const playNotificationSound = useCallback(() => {
    if (!reminderSound || typeof window === "undefined") return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.error("Audio synth error:", e);
    }
  }, [reminderSound]);

  // Play Azan Audio (or fallback synth chime)
  const playAzanSound = useCallback((prayerName, forceVoice) => {
    if (!reminderSound || typeof window === "undefined") return;

    const selectedVoice = forceVoice || azanVoice;

    if (selectedVoice === "chime") {
      playNotificationSound();
      return;
    }

    let audioUrl = "/audio/azan_makkah.mp3";
    if (prayerName === "Fajr" || selectedVoice === "fajr") {
      audioUrl = "/audio/azan_fajr.mp3";
    } else if (selectedVoice === "madinah") {
      audioUrl = "/audio/azan_madinah.mp3";
    } else if (selectedVoice === "makkah") {
      audioUrl = "/audio/azan_makkah.mp3";
    }

    try {
      stopAzanSound();

      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;

      audio.onended = () => {
        setIsAzanPlaying(false);
        setActiveAzanPrayer("");
        activeAudioRef.current = null;
      };

      audio.onerror = () => {
        console.warn("Azan audio playback failed, falling back to chime sound.");
        playNotificationSound();
        setIsAzanPlaying(false);
        setActiveAzanPrayer("");
        activeAudioRef.current = null;
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAzanPlaying(true);
            setActiveAzanPrayer(prayerName || "Namaz");
          })
          .catch((err) => {
            console.warn("Auto-play prevented or failed, falling back to soft chime:", err);
            playNotificationSound();
            setIsAzanPlaying(false);
            setActiveAzanPrayer("");
          });
      }
    } catch (e) {
      console.error("Error playing Azan audio:", e);
      playNotificationSound();
    }
  }, [reminderSound, azanVoice, playNotificationSound, stopAzanSound]);

  // Load logs & sync with user account
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    loadLocalSettings(user?.id);

    async function handleSyncAndLoad() {
      const suffix = user?.id ? `_${user.id}` : "_guest";
      const logsKey = `quran_namaz_tracker_logs${suffix}`;
      const guestLogsKey = "quran_namaz_tracker_logs_guest";

      let localUserLogs = {};
      try {
        const rawUserLogs = localStorage.getItem(logsKey) || (!user ? localStorage.getItem(LEGACY_STORAGE_KEY_LOGS) : null);
        if (rawUserLogs) {
          localUserLogs = JSON.parse(rawUserLogs) || {};
        }
      } catch (e) {
        console.error("Error parsing local user logs:", e);
      }

      let guestLogs = {};
      try {
        const rawGuestLogs = localStorage.getItem(guestLogsKey);
        if (rawGuestLogs) {
          guestLogs = JSON.parse(rawGuestLogs) || {};
        }
      } catch (e) {
        console.error("Error parsing guest logs:", e);
      }

      if (!session?.access_token || !user?.id) {
        if (isMounted) {
          setCompletedLogs(localUserLogs);
          setIsSyncedWithAccount(false);
        }
        return;
      }

      try {
        const res = await fetch("/api/prayer-tracker", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const remoteLogs = data.logs || {};

          const mergedLogs = { ...remoteLogs };
          const localCombined = { ...guestLogs, ...localUserLogs };

          Object.keys(localCombined).forEach((dateStr) => {
            const localDay = localCombined[dateStr] || {};
            const remoteDay = remoteLogs[dateStr] || {};
            mergedLogs[dateStr] = {
              Fajr: !!(localDay.Fajr || remoteDay.Fajr),
              Dhuhr: !!(localDay.Dhuhr || remoteDay.Dhuhr),
              Asr: !!(localDay.Asr || remoteDay.Asr),
              Maghrib: !!(localDay.Maghrib || remoteDay.Maghrib),
              Isha: !!(localDay.Isha || remoteDay.Isha),
            };
          });

          if (isMounted) {
            setCompletedLogs(mergedLogs);
            setIsSyncedWithAccount(true);
            try {
              localStorage.setItem(logsKey, JSON.stringify(mergedLogs));
              localStorage.removeItem(guestLogsKey);
            } catch (e) {
              console.error("Failed to save merged logs:", e);
            }
          }

          await fetch("/api/prayer-tracker", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ logsMap: mergedLogs }),
          });
        } else {
          if (isMounted) {
            setCompletedLogs({ ...guestLogs, ...localUserLogs });
            setIsSyncedWithAccount(false);
          }
        }
      } catch (err) {
        console.error("Failed to sync prayer tracker with account:", err);
        if (isMounted) {
          setCompletedLogs({ ...guestLogs, ...localUserLogs });
          setIsSyncedWithAccount(false);
        }
      }
    }

    handleSyncAndLoad();

    return () => {
      isMounted = false;
    };
  }, [user?.id, session?.access_token, loadLocalSettings]);

  // Update global timings manually or from components
  const updateGlobalTimings = useCallback((newTimings) => {
    if (newTimings && typeof newTimings === "object") {
      setGlobalTimings(newTimings);
    }
  }, []);

  // Fetch timings if not available globally
  useEffect(() => {
    if (globalTimings || typeof window === "undefined") return;

    let isMounted = true;
    const fetchTimingsForContext = async () => {
      try {
        const savedMethod = localStorage.getItem("quran_prayer_method") || "3";
        const savedSchool = localStorage.getItem("quran_prayer_school") || "0";
        const savedManual = localStorage.getItem("quran_manual_location");

        let url = "";
        if (savedManual) {
          try {
            const parsed = JSON.parse(savedManual);
            if (parsed.isGps && parsed.latitude && parsed.longitude) {
              url = `${ALADHAN_API_BASE_URL}/timings?latitude=${parsed.latitude}&longitude=${parsed.longitude}&method=${savedMethod}&school=${savedSchool}`;
            } else if (parsed.city) {
              const query = parsed.country ? `${parsed.city}, ${parsed.country}` : parsed.city;
              url = `${ALADHAN_API_BASE_URL}/timingsByAddress?address=${encodeURIComponent(query)}&method=${savedMethod}&school=${savedSchool}`;
            }
          } catch (e) {
            console.error("Failed to parse manual location in context:", e);
          }
        }

        if (!url) {
          url = `${ALADHAN_API_BASE_URL}/timingsByAddress?address=Dhaka, Bangladesh&method=${savedMethod}&school=${savedSchool}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 200 && data.data?.timings && isMounted) {
          setGlobalTimings(data.data.timings);
        }
      } catch (err) {
        console.error("Error fetching context timings:", err);
      }
    };

    fetchTimingsForContext();
    return () => {
      isMounted = false;
    };
  }, [globalTimings]);

  // Toggle Global Reminders ON/OFF
  const toggleGlobalReminders = async (forcedValue) => {
    const nextVal = typeof forcedValue === "boolean" ? forcedValue : !remindersEnabled;

    if (nextVal && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted") {
        try {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") {
            console.log("Notification permission not granted");
          }
        } catch (err) {
          console.error("Error requesting notification permission:", err);
        }
      }
    }

    setRemindersEnabled(nextVal);
    saveSettings(nextVal, prayerReminders, reminderSound, azanVoice);
  };

  // Toggle Individual Prayer Reminder
  const togglePrayerReminder = (prayerName) => {
    const nextMap = {
      ...prayerReminders,
      [prayerName]: !prayerReminders[prayerName],
    };
    setPrayerReminders(nextMap);
    saveSettings(remindersEnabled, nextMap, reminderSound, azanVoice);
  };

  // Toggle Sound Notifications
  const toggleReminderSound = () => {
    const nextSound = !reminderSound;
    setReminderSound(nextSound);
    saveSettings(remindersEnabled, prayerReminders, nextSound, azanVoice);
  };

  // Toggle Prayer Completion Checkmark
  const togglePrayerCompletion = (dateStr, prayerName) => {
    const targetDate = dateStr || new Date().toISOString().split("T")[0];
    let nextStatus = false;

    setCompletedLogs((prev) => {
      const dayData = prev[targetDate] || {};
      nextStatus = !dayData[prayerName];
      const updatedDay = {
        ...dayData,
        [prayerName]: nextStatus,
      };

      const updatedLogs = {
        ...prev,
        [targetDate]: updatedDay,
      };

      if (typeof window !== "undefined") {
        try {
          const suffix = user?.id ? `_${user.id}` : "_guest";
          const logsKey = `quran_namaz_tracker_logs${suffix}`;
          localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
        } catch (e) {
          console.error("Failed to save prayer logs to localStorage:", e);
        }
      }

      return updatedLogs;
    });

    if (nextStatus) {
      toast.success(`Marked ${prayerName} as completed!`, { toastId: `toast_${targetDate}_${prayerName}` });
    } else {
      toast.info(`Marked ${prayerName} as incomplete.`, { toastId: `toast_${targetDate}_${prayerName}` });
    }

    if (session?.access_token) {
      fetch("/api/prayer-tracker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          date: targetDate,
          prayerName,
          completed: nextStatus,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setIsSyncedWithAccount(true);
          } else {
            setIsSyncedWithAccount(false);
          }
        })
        .catch((err) => {
          console.error("Failed to sync prayer completion:", err);
          setIsSyncedWithAccount(false);
        });
    }
  };

  // Get daily completion status
  const getDailyStatus = useCallback(
    (dateStr) => {
      const targetDate = dateStr || new Date().toISOString().split("T")[0];
      const dayData = completedLogs[targetDate] || {};
      const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

      let completedCount = 0;
      const statusMap = {};

      corePrayers.forEach((p) => {
        const isDone = !!dayData[p];
        statusMap[p] = isDone;
        if (isDone) completedCount++;
      });

      return {
        date: targetDate,
        completedCount,
        total: 5,
        percentage: Math.round((completedCount / 5) * 100),
        statusMap,
      };
    },
    [completedLogs]
  );

  // Calculate streak
  const getStreakCount = useCallback(() => {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayStatus = getDailyStatus(dateStr);

      if (dayStatus.completedCount === 5) {
        streak++;
      } else if (i === 0 && dayStatus.completedCount < 5) {
        continue;
      } else {
        break;
      }
    }

    return streak;
  }, [getDailyStatus]);

  // Calculate stats
  const getStats = useCallback(
    (daysWindow = 30) => {
      const today = new Date();
      let totalCompleted = 0;
      const prayerBreakdown = { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
      const dailyHistory = [];

      for (let i = 0; i < daysWindow; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const dayStatus = getDailyStatus(dateStr);

        totalCompleted += dayStatus.completedCount;

        Object.keys(dayStatus.statusMap).forEach((p) => {
          if (dayStatus.statusMap[p]) {
            prayerBreakdown[p] = (prayerBreakdown[p] || 0) + 1;
          }
        });

        dailyHistory.push(dayStatus);
      }

      const totalExpected = daysWindow * 5;
      const overallPercentage = Math.round((totalCompleted / totalExpected) * 100) || 0;

      return {
        daysWindow,
        totalCompleted,
        totalExpected,
        overallPercentage,
        prayerBreakdown,
        dailyHistory,
      };
    },
    [getDailyStatus]
  );

  // Trigger Notification for a specific prayer time
  const triggerPrayerNotification = useCallback(
    (prayerName) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const notifyKey = `${todayStr}_${prayerName}`;

      if (notifiedMap[notifyKey]) return;

      setNotifiedMap((prev) => {
        const updated = { ...prev, [notifyKey]: true };
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(NOTIFIED_MAP_KEY, JSON.stringify(updated));
          } catch (e) {
            console.error("Failed to save notifiedMap:", e);
          }
        }
        return updated;
      });

      // Play Azan Audio / Chime
      playAzanSound(prayerName);

      // Display Browser Notification
      const title = `Time for ${prayerName} Prayer! (Azan)`;
      const options = {
        body: `It is now time for ${prayerName} Salah. May Allah accept your prayers!`,
        icon: "/quran.svg",
        badge: "/quran.svg",
        tag: `namaz-notification-${prayerName}`,
        renotify: true,
        data: { url: "/prayer" },
        requireInteraction: true,
      };

      if (swRegistration && swRegistration.showNotification) {
        swRegistration.showNotification(title, options).catch(() => {
          fallbackNotification(title, options);
        });
      } else {
        fallbackNotification(title, options);
      }
    },
    [notifiedMap, swRegistration, playAzanSound]
  );

  function fallbackNotification(title, options) {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, options);
      } catch (e) {
        console.error("Web Notification error:", e);
      }
    }
  }

  // Background checker for Prayer Timings with Date-based window matching
  const checkTimings = useCallback(
    (timingsToCheck) => {
      const activeTimings = timingsToCheck || globalTimings;
      if (!remindersEnabled || !activeTimings) return;

      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

      corePrayers.forEach((prayerName) => {
        if (!prayerReminders[prayerName]) return;
        const timeVal = activeTimings[prayerName];
        if (!timeVal) return;

        const cleanTime = timeVal.split(" ")[0];
        const [hStr, mStr] = cleanTime.split(":");
        if (!hStr || !mStr) return;

        const prayerDate = new Date(now);
        prayerDate.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);

        const diffMs = now.getTime() - prayerDate.getTime();
        const notifyKey = `${todayStr}_${prayerName}`;

        if (diffMs >= 0 && diffMs <= 15 * 60 * 1000) {
          if (!notifiedMap[notifyKey]) {
            triggerPrayerNotification(prayerName);
          }
        }
      });
    },
    [remindersEnabled, prayerReminders, globalTimings, notifiedMap, triggerPrayerNotification]
  );

  // Continuous background ticker
  useEffect(() => {
    if (!remindersEnabled || !globalTimings) return;

    checkTimings(globalTimings);

    const intervalId = setInterval(() => {
      checkTimings(globalTimings);
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTimings(globalTimings);
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [remindersEnabled, globalTimings, checkTimings]);

  // Sync scheduled prayers with Service Worker
  useEffect(() => {
    if (!remindersEnabled || !globalTimings) return;

    if (typeof navigator !== "undefined" && navigator.serviceWorker && navigator.serviceWorker.controller) {
      const now = new Date();
      const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const upcomingPrayers = [];

      corePrayers.forEach((prayerName) => {
        if (!prayerReminders[prayerName]) return;
        const timeVal = globalTimings[prayerName];
        if (!timeVal) return;

        const cleanTime = timeVal.split(" ")[0];
        const [hStr, mStr] = cleanTime.split(":");
        if (!hStr || !mStr) return;

        const prayerDate = new Date(now);
        prayerDate.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);

        if (prayerDate.getTime() > now.getTime()) {
          upcomingPrayers.push({
            name: prayerName,
            timeMs: prayerDate.getTime(),
            voice: azanVoice,
          });
        }
      });

      navigator.serviceWorker.controller.postMessage({
        type: "SCHEDULE_PRAYERS",
        prayers: upcomingPrayers,
      });
    }
  }, [remindersEnabled, prayerReminders, globalTimings, swRegistration, azanVoice]);

  const value = {
    user,
    isSyncedWithAccount,
    remindersEnabled,
    prayerReminders,
    reminderSound,
    azanVoice,
    isAzanPlaying,
    activeAzanPrayer,
    changeAzanVoice,
    playAzanSound,
    stopAzanSound,
    globalTimings,
    updateGlobalTimings,
    toggleGlobalReminders,
    togglePrayerReminder,
    toggleReminderSound,
    togglePrayerCompletion,
    getDailyStatus,
    getStreakCount,
    getStats,
    checkTimings,
    playNotificationSound,
  };

  return (
    <PrayerTrackerContext.Provider value={value}>
      {children}

      {/* Floating Active Azan Audio Player Control Banner */}
      {isAzanPlaying && (
        <div className="fixed bottom-6 right-6 z-[30000] flex items-center gap-4 p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Volume2 size={20} className="animate-pulse text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Playing Azan - {activeAzanPrayer}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {azanVoice === "madinah"
                  ? "Madinah Adhan"
                  : azanVoice === "fajr"
                  ? "Fajr Adhan"
                  : azanVoice === "chime"
                  ? "Soft Chime"
                  : "Makkah Adhan"}
              </span>
            </div>
          </div>

          <button
            onClick={stopAzanSound}
            className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shadow-rose-600/30"
          >
            <Square size={13} className="fill-current" />
            Stop Azan
          </button>
        </div>
      )}
    </PrayerTrackerContext.Provider>
  );
}
