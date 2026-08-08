"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/UserProvider";
import { toast } from "react-toastify";

const PrayerTrackerContext = createContext(null);

export function usePrayerTracker() {
  return useContext(PrayerTrackerContext);
}

const LEGACY_STORAGE_KEY_SETTINGS = "quran_namaz_reminder_settings";
const LEGACY_STORAGE_KEY_LOGS = "quran_namaz_tracker_logs";

function getStorageKeys(userId) {
  const suffix = userId ? `_${userId}` : "_guest";
  return {
    settingsKey: `quran_namaz_reminder_settings${suffix}`,
    logsKey: `quran_namaz_tracker_logs${suffix}`,
    guestLogsKey: "quran_namaz_tracker_logs_guest",
  };
}

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

  // 2. Prayer completion logs state: { "YYYY-MM-DD": { Fajr: true, Dhuhr: true, ... } }
  const [completedLogs, setCompletedLogs] = useState({});
  const [isSyncedWithAccount, setIsSyncedWithAccount] = useState(false);

  // 3. Track last notified prayer to avoid duplicate alerts: { "2026-08-03_Fajr": true }
  const [notifiedMap, setNotifiedMap] = useState({});

  // Helper to load settings from storage
  const loadLocalSettings = useCallback((userId) => {
    if (typeof window === "undefined") return;
    try {
      const keys = getStorageKeys(userId);
      let savedSettings = localStorage.getItem(keys.settingsKey);
      if (!savedSettings && !userId) {
        savedSettings = localStorage.getItem(LEGACY_STORAGE_KEY_SETTINGS);
      }
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.remindersEnabled === "boolean") setRemindersEnabled(parsed.remindersEnabled);
        if (parsed.prayerReminders) setPrayerReminders(parsed.prayerReminders);
        if (typeof parsed.reminderSound === "boolean") setReminderSound(parsed.reminderSound);
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage:", e);
    }
  }, []);

  // Helper to save settings to storage
  const saveSettings = useCallback((newRemindersEnabled, newPrayerReminders, newSound) => {
    if (typeof window === "undefined") return;
    try {
      const keys = getStorageKeys(user?.id);
      const payload = JSON.stringify({
        remindersEnabled: newRemindersEnabled,
        prayerReminders: newPrayerReminders,
        reminderSound: newSound,
      });
      localStorage.setItem(keys.settingsKey, payload);
    } catch (e) {
      console.error("Failed to save reminder settings:", e);
    }
  }, [user?.id]);

  // Load logs & sync with user account when session or user changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    // First load settings for current state
    loadLocalSettings(user?.id);

    async function handleSyncAndLoad() {
      const keys = getStorageKeys(user?.id);

      // Read local user logs & guest logs
      let localUserLogs = {};
      try {
        const rawUserLogs = localStorage.getItem(keys.logsKey) || (!user ? localStorage.getItem(LEGACY_STORAGE_KEY_LOGS) : null);
        if (rawUserLogs) {
          localUserLogs = JSON.parse(rawUserLogs) || {};
        }
      } catch (e) {
        console.error("Error parsing local user logs:", e);
      }

      let guestLogs = {};
      try {
        const rawGuestLogs = localStorage.getItem(keys.guestLogsKey);
        if (rawGuestLogs) {
          guestLogs = JSON.parse(rawGuestLogs) || {};
        }
      } catch (e) {
        console.error("Error parsing guest logs:", e);
      }

      if (!session?.access_token || !user?.id) {
        // Unauthenticated / Guest Mode
        if (isMounted) {
          setCompletedLogs(localUserLogs);
          setIsSyncedWithAccount(false);
        }
        return;
      }

      // User logged in: Sync with account API
      try {
        const res = await fetch("/api/prayer-tracker", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const remoteLogs = data.logs || {};

          // Merge: remote + local user logs + guest logs
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
              localStorage.setItem(keys.logsKey, JSON.stringify(mergedLogs));
              // Clear guest logs since they have been migrated
              localStorage.removeItem(keys.guestLogsKey);
            } catch (e) {
              console.error("Failed to save merged logs to localStorage:", e);
            }
          }

          // Push merged dataset back to server database to ensure full sync
          await fetch("/api/prayer-tracker", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ logsMap: mergedLogs }),
          });
        } else {
          // If fetch remote failed, fallback to local user logs
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

  // Toggle Global Reminders ON/OFF
  const toggleGlobalReminders = async (forcedValue) => {
    const nextVal = typeof forcedValue === "boolean" ? forcedValue : !remindersEnabled;

    if (nextVal && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
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
    saveSettings(nextVal, prayerReminders, reminderSound);
  };

  // Toggle Individual Prayer Reminder (Fajr, Dhuhr, etc.)
  const togglePrayerReminder = (prayerName) => {
    const nextMap = {
      ...prayerReminders,
      [prayerName]: !prayerReminders[prayerName],
    };
    setPrayerReminders(nextMap);
    saveSettings(remindersEnabled, nextMap, reminderSound);
  };

  // Toggle Sound Notifications
  const toggleReminderSound = () => {
    const nextSound = !reminderSound;
    setReminderSound(nextSound);
    saveSettings(remindersEnabled, prayerReminders, nextSound);
  };

  // Toggle Prayer Completion Checkmark for a given date (defaults to today YYYY-MM-DD)
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
          const keys = getStorageKeys(user?.id);
          localStorage.setItem(keys.logsKey, JSON.stringify(updatedLogs));
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

    // Sync toggle to user account DB if logged in
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
            console.warn("Prayer completion sync returned non-OK status:", res.status);
            setIsSyncedWithAccount(false);
          }
        })
        .catch((err) => {
          console.error("Failed to sync prayer completion to user account:", err);
          setIsSyncedWithAccount(false);
        });
    }
  };

  // Get daily completion status for a specific date
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

  // Calculate current streak count (consecutive days with 5/5 completed)
  const getStreakCount = useCallback(() => {
    let streak = 0;
    const today = new Date();

    // Check backwards starting from today or yesterday
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayStatus = getDailyStatus(dateStr);

      if (dayStatus.completedCount === 5) {
        streak++;
      } else if (i === 0 && dayStatus.completedCount < 5) {
        // If today is not finished yet, don't break streak from yesterday
        continue;
      } else {
        break;
      }
    }

    return streak;
  }, [getDailyStatus]);

  // Calculate activity statistics over a window of days (e.g. 7, 30 days)
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

  // Play soft synthesized alert sound for prayer notification
  const playNotificationSound = () => {
    if (!reminderSound || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
  };

  // Trigger Notification for a specific prayer time
  const triggerPrayerNotification = useCallback(
    (prayerName) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const notifyKey = `${todayStr}_${prayerName}`;

      if (notifiedMap[notifyKey]) return; // Already notified today

      setNotifiedMap((prev) => ({ ...prev, [notifyKey]: true }));

      // Sound alert
      playNotificationSound();

      // Browser Notification
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification(`Time for ${prayerName} Prayer!`, {
            body: `It is now time for ${prayerName} Salah. May Allah accept your prayers!`,
            icon: "/quran.svg",
          });
        } catch (e) {
          console.error("Web Notification error:", e);
        }
      }
    },
    [notifiedMap, reminderSound]
  );

  // Background checker for Prayer Timings
  const checkTimings = useCallback(
    (timings) => {
      if (!remindersEnabled || !timings) return;

      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMins = now.getMinutes().toString().padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMins}`;

      const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

      corePrayers.forEach((prayerName) => {
        if (!prayerReminders[prayerName]) return;
        const timeVal = timings[prayerName];
        if (!timeVal) return;

        const cleanTime = timeVal.split(" ")[0]; // "05:12 (BDT)" -> "05:12"
        if (cleanTime === currentTimeStr) {
          triggerPrayerNotification(prayerName);
        }
      });
    },
    [remindersEnabled, prayerReminders, triggerPrayerNotification]
  );

  const value = {
    user,
    isSyncedWithAccount,
    remindersEnabled,
    prayerReminders,
    reminderSound,
    completedLogs,
    toggleGlobalReminders,
    togglePrayerReminder,
    toggleReminderSound,
    togglePrayerCompletion,
    getDailyStatus,
    getStreakCount,
    getStats,
    checkTimings,
  };

  return (
    <PrayerTrackerContext.Provider value={value}>
      {children}
    </PrayerTrackerContext.Provider>
  );
}
