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

function urlBase64ToUint8Array(base64String) {
  if (!base64String) return new Uint8Array(0);
  try {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (e) {
    console.error("Failed to convert VAPID key base64:", e);
    return new Uint8Array(0);
  }
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
  const [azanVoice, setAzanVoice] = useState("makkah");

  // 2. Azan Audio Playback state
  const [isAzanPlaying, setIsAzanPlaying] = useState(false);
  const [activeAzanPrayer, setActiveAzanPrayer] = useState("");
  const activeAudioRef = useRef(null);

  // 3. Test Alarm Target state for closed-tab background testing
  const [testAlarmTargetMs, setTestAlarmTargetMs] = useState(null);

  // 4. Prayer completion logs state
  const [completedLogs, setCompletedLogs] = useState({});
  const [isSyncedWithAccount, setIsSyncedWithAccount] = useState(false);

  // 5. Service worker registration & global timings state
  const [swRegistration, setSwRegistration] = useState(null);
  const [globalTimings, setGlobalTimings] = useState(null);

  // 6. Track last notified prayer to avoid duplicate alerts
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

  // Register Service Worker and force update to ensure new version activates
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setSwRegistration(reg);
          // Force update to download new SW version with push handlers
          reg.update().catch((e) => console.log("SW update check:", e));
        })
        .catch((err) => {
          console.error("ServiceWorker registration failed:", err);
        });
    }
  }, []);

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
  }, [reminderSound, azanVoice, stopAzanSound]);

  // Handle notification click query parameter triggers on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("playAzan") === "true") {
      const pName = params.get("prayer") || "Namaz";
      const voice = params.get("voice");
      playAzanSound(pName, voice);

      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [playAzanSound]);

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

  // Change Azan Voice and automatically play audio preview immediately!
  const changeAzanVoice = (voice, autoPlay = true) => {
    setAzanVoice(voice);
    saveSettings(remindersEnabled, prayerReminders, reminderSound, voice);

    if (autoPlay) {
      const testPrayerName = voice === "fajr" ? "Fajr" : "Dhuhr";
      playAzanSound(testPrayerName, voice);
    }
  };

  // Synchronize Push Subscription with PostgreSQL database
  const syncPushSubscription = useCallback(
    async (enabled, currentReminders, voice, isUserGesture = false) => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

      console.log("Web Push Sync: starting...", { enabled, voice, isUserGesture });

      try {
        const reg = swRegistration || (navigator.serviceWorker && (await navigator.serviceWorker.ready));
        if (!reg || !reg.pushManager) {
          console.warn("Web Push Sync: PushManager not available on this device/browser");
          return;
        }

        const activeSub = await reg.pushManager.getSubscription();

        if (!enabled) {
          if (activeSub) {
            console.log("Web Push Sync: removing active subscription from database...");
            await fetch("/api/push/subscribe", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ endpoint: activeSub.endpoint }),
            }).catch(() => {});
            await activeSub.unsubscribe().catch(() => {});
            console.log("Web Push Sync: unsubscribed successfully.");
          }
          return;
        }

        // On mobile browsers, requestPermission MUST be in response to a direct user action
        if (!("Notification" in window)) {
          console.warn("Web Push Sync: Notification API not supported");
          return;
        }

        if (Notification.permission !== "granted") {
          if (isUserGesture) {
            console.log("Web Push Sync: requesting permission with user gesture...");
            try {
              const perm = await Notification.requestPermission();
              if (perm !== "granted") {
                console.warn("Web Push Sync: notification permission denied or dismissed by user");
                return;
              }
            } catch (permErr) {
              console.error("Web Push Sync: requestPermission error:", permErr);
              return;
            }
          } else {
            console.log("Web Push Sync: notifications not granted yet, skipping background prompt until user gesture");
            return;
          }
        }

        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.warn("Web Push Sync: VAPID public key missing in environment");
          return;
        }

        let sub = activeSub;
        if (sub) {
          // Detect VAPID key changes and force re-subscription
          try {
            const activeKey = sub.options?.applicationServerKey;
            if (activeKey) {
              const activeKeyUint8 = new Uint8Array(activeKey);
              const currentKeyUint8 = urlBase64ToUint8Array(vapidPublicKey);

              let keyMatches = activeKeyUint8.length === currentKeyUint8.length;
              if (keyMatches) {
                for (let i = 0; i < activeKeyUint8.length; i++) {
                  if (activeKeyUint8[i] !== currentKeyUint8[i]) {
                    keyMatches = false;
                    break;
                  }
                }
              }

              if (!keyMatches) {
                console.log("Web Push Sync: VAPID keys changed, renewing subscription...");
                await fetch("/api/push/subscribe", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ endpoint: sub.endpoint }),
                }).catch(() => {});
                await sub.unsubscribe().catch(() => {});
                sub = null;
              }
            }
          } catch (keyErr) {
            console.warn("Web Push Sync: error checking existing VAPID key compatibility:", keyErr);
          }
        }

        if (!sub) {
          console.log("Web Push Sync: creating new push subscription...");
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
          console.log("Web Push Sync: new push subscription established.");
        }

        let savedManual = null;
        let savedMethod = 3;
        let savedSchool = 0;
        let cityStr = "Dhaka";
        let countryStr = "Bangladesh";

        try {
          savedMethod = parseInt(localStorage.getItem("quran_prayer_method") || "3", 10);
          savedSchool = parseInt(localStorage.getItem("quran_prayer_school") || "0", 10);
          const rawManual = localStorage.getItem("quran_manual_location");
          if (rawManual) {
            savedManual = JSON.parse(rawManual);
            if (typeof savedManual === "string") {
              cityStr = savedManual;
            } else if (typeof savedManual === "object" && savedManual !== null) {
              if (typeof savedManual.city === "string") {
                cityStr = savedManual.city;
              } else if (typeof savedManual.city === "object" && savedManual.city?.city) {
                cityStr = savedManual.city.city;
              }
              if (typeof savedManual.country === "string") {
                countryStr = savedManual.country;
              }
            }
          }
        } catch (e) {}

        const activeRemindersList = [];
        const remindersToCheck = currentReminders || prayerReminders;
        Object.keys(remindersToCheck).forEach((p) => {
          if (remindersToCheck[p]) activeRemindersList.push(p);
        });

        // Robust key extraction across mobile & desktop browser implementations
        const subJson = sub.toJSON ? sub.toJSON() : {};
        const rawKeys = subJson.keys || {};
        let p256dhKey = rawKeys.p256dh || "";
        let authKey = rawKeys.auth || "";

        if (!p256dhKey && sub.getKey) {
          const pBuffer = sub.getKey("p256dh");
          if (pBuffer) p256dhKey = btoa(String.fromCharCode.apply(null, new Uint8Array(pBuffer)));
        }
        if (!authKey && sub.getKey) {
          const aBuffer = sub.getKey("auth");
          if (aBuffer) authKey = btoa(String.fromCharCode.apply(null, new Uint8Array(aBuffer)));
        }

        const subscribePayload = {
          subscription: {
            endpoint: sub.endpoint,
            keys: {
              p256dh: p256dhKey,
              auth: authKey,
            },
          },
          userId: user?.id || null,
          city: cityStr,
          country: countryStr,
          method: savedMethod,
          school: savedSchool,
          voice: voice || azanVoice,
          reminders: activeRemindersList.join(","),
        };

        console.log("Web Push Sync: synchronizing subscription to database backend...");
        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscribePayload),
        });

        if (res.ok) {
          console.log("Web Push Sync: successfully synchronized subscription to database!");
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error("Web Push Sync: backend subscription failed:", errData);
        }
      } catch (err) {
        console.error("Web Push Sync: failed to sync push subscription:", err);
      }
    },
    [swRegistration, prayerReminders, azanVoice, user?.id]
  );

  // Sync push subscription state with database automatically (silent, gesture=false)
  useEffect(() => {
    if (swRegistration && remindersEnabled) {
      syncPushSubscription(remindersEnabled, prayerReminders, azanVoice, false);
    }
  }, [remindersEnabled, prayerReminders, azanVoice, swRegistration, syncPushSubscription]);

  // Test Real Browser Notification & Sound (including Web Push API verification)
  const testNotification = useCallback(async () => {
    if (typeof window === "undefined") return;

    // Check iOS PWA status
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);

    if (isIOS && !isStandalone) {
      toast.info("📱 On iPhone/iPad: Tap the Safari Share button -> 'Add to Home Screen' to enable Web Push notifications on iOS.", {
        autoClose: 8000,
      });
    }

    if (!("Notification" in window)) {
      toast.error("Browser notifications are not supported in this browser.");
      return;
    }

    let perm = Notification.permission;
    if (perm !== "granted") {
      try {
        perm = await Notification.requestPermission();
      } catch (e) {
        console.error(e);
      }
    }

    if (perm !== "granted") {
      toast.warning("Notification permission not granted. Please allow notification permissions in your browser or device settings.");
      return;
    }

    // Play sound preview locally
    playAzanSound("Test Prayer");

    // Try sending a real server-side Web Push notification to test closed-tab pathway
    let webPushTriggered = false;
    try {
      const reg = swRegistration || (navigator.serviceWorker && (await navigator.serviceWorker.ready));
      if (reg && reg.pushManager) {
        let activeSub = await reg.pushManager.getSubscription();
        if (!activeSub) {
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (vapidPublicKey) {
            activeSub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });
            // Ensure DB record is updated
            await syncPushSubscription(true, prayerReminders, azanVoice, true);
          }
        }

        if (activeSub) {
          const subJson = activeSub.toJSON ? activeSub.toJSON() : {};
          const rawKeys = subJson.keys || {};
          let p256dhKey = rawKeys.p256dh || "";
          let authKey = rawKeys.auth || "";

          if (!p256dhKey && activeSub.getKey) {
            const pBuf = activeSub.getKey("p256dh");
            if (pBuf) p256dhKey = btoa(String.fromCharCode.apply(null, new Uint8Array(pBuf)));
          }
          if (!authKey && activeSub.getKey) {
            const aBuf = activeSub.getKey("auth");
            if (aBuf) authKey = btoa(String.fromCharCode.apply(null, new Uint8Array(aBuf)));
          }

          const voiceLabel = azanVoice === "madinah" ? "Madinah Azan" : azanVoice === "fajr" ? "Fajr Azan" : azanVoice === "chime" ? "Soft Chime" : "Makkah Azan";

          const pushRes = await fetch("/api/push/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: activeSub.endpoint,
              p256dh: p256dhKey,
              auth: authKey,
              title: `🔔 Real Web Push Test (${voiceLabel})`,
              message: "This push notification was delivered from the server. Background push alerts are active!",
              voice: azanVoice,
              prayerName: "Test Push Alert",
            }),
          });

          if (pushRes.ok) {
            webPushTriggered = true;
          } else if (pushRes.status === 410) {
            console.log("Subscription was expired (410), renewing push subscription...");
            await activeSub.unsubscribe().catch(() => {});
            await syncPushSubscription(true, prayerReminders, azanVoice, true);
          }
        }
      }
    } catch (pushErr) {
      console.warn("Failed to trigger server-side test push:", pushErr);
    }

    if (!webPushTriggered) {
      const voiceLabel = azanVoice === "madinah" ? "Madinah" : azanVoice === "fajr" ? "Fajr" : azanVoice === "chime" ? "Chime" : "Makkah";
      const title = `🔔 Local Test Namaz Alert (${voiceLabel})`;
      const options = {
        body: "Local alerts are working! Background push notification is also configured.",
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        tag: `namaz-test-${Date.now()}`,
        renotify: true,
        data: { url: "/prayer" },
      };

      try {
        const reg = swRegistration || (navigator.serviceWorker && (await navigator.serviceWorker.ready));
        if (reg && reg.showNotification) {
          await reg.showNotification(title, options);
        } else {
          fallbackNotification(title, options);
        }
      } catch (err) {
        console.error("SW notification error, fallback to standard Notification:", err);
        fallbackNotification(title, options);
      }
    }

    toast.success("Test notification triggered!");
  }, [azanVoice, swRegistration, playAzanSound, prayerReminders, syncPushSubscription]);

  // Schedule a custom closed-tab test alarm (seconds or time string)
  const scheduleTestAlarm = useCallback(
    async (delayInput, customLabel = "Closed-Tab Test Azan") => {
      if (typeof window === "undefined") return;

      if (!("Notification" in window)) {
        toast.error("Browser notifications are not supported in this browser.");
        return;
      }

      let perm = Notification.permission;
      if (perm !== "granted") {
        try {
          perm = await Notification.requestPermission();
        } catch (e) {
          console.error(e);
        }
      }

      if (perm !== "granted") {
        toast.warning("Please allow browser notification permissions first.");
        return;
      }

      let targetTimeMs = Date.now() + 10000;

      if (typeof delayInput === "number") {
        targetTimeMs = Date.now() + delayInput * 1000;
      } else if (typeof delayInput === "string" && delayInput.includes(":")) {
        const [hStr, mStr] = delayInput.split(":");
        const now = new Date();
        const targetDate = new Date(now);
        targetDate.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);

        if (targetDate.getTime() <= now.getTime()) {
          targetDate.setDate(targetDate.getDate() + 1);
        }
        targetTimeMs = targetDate.getTime();
      }

      setTestAlarmTargetMs(targetTimeMs);

      const swController = navigator.serviceWorker.controller || (swRegistration && swRegistration.active);
      if (swController) {
        swController.postMessage({
          type: "SCHEDULE_TEST_ALARM",
          testTimeMs: targetTimeMs,
          label: customLabel,
          voice: azanVoice,
        });
      }

      const timeString = new Date(targetTimeMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const delaySecs = Math.max(1, Math.round((targetTimeMs - Date.now()) / 1000));

      toast.success(`⏰ Test alarm set for ${timeString} (in ${delaySecs}s)! Close or exit the website now to test background notifications.`, {
        autoClose: 7000,
      });
    },
    [azanVoice, swRegistration]
  );

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

    if (nextVal && typeof window !== "undefined") {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isStandalone = window.navigator.standalone || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);

      if (isIOS && !isStandalone) {
        toast.info("📱 On iPhone/iPad: To receive push notifications, tap Safari Share -> 'Add to Home Screen', then launch the app from your home screen!", {
          autoClose: 9000,
        });
      }

      if ("Notification" in window) {
        if (Notification.permission !== "granted") {
          try {
            const perm = await Notification.requestPermission();
            if (perm !== "granted") {
              toast.warning("Notification permission not granted. Please allow notification permissions in your browser or device settings.");
            }
          } catch (err) {
            console.error("Error requesting notification permission:", err);
          }
        }
      }
    }

    setRemindersEnabled(nextVal);
    saveSettings(nextVal, prayerReminders, reminderSound, azanVoice);
    syncPushSubscription(nextVal, prayerReminders, azanVoice, true);
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

      playAzanSound(prayerName);

      const title = `Time for ${prayerName} Prayer! (Azan)`;
      const options = {
        body: `It is now time for ${prayerName} Salah. May Allah accept your prayers!`,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        tag: `namaz-notification-${prayerName}`,
        renotify: true,
        data: { url: "/prayer" },
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

  async function fallbackNotification(title, options) {
    if (typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, options);
          return;
        }
      }
      new Notification(title, options);
    } catch (e) {
      console.warn("Web Notification error:", e);
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

  // Sync full prayer configuration & location with Service Worker for persistent background notifications (even when app is closed)
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.serviceWorker) return;

    const syncSWConfig = () => {
      const swController = navigator.serviceWorker.controller || (swRegistration && swRegistration.active);
      if (!swController) return;

      let savedManual = null;
      let savedMethod = 3;
      let savedSchool = 0;
      try {
        savedMethod = parseInt(localStorage.getItem("quran_prayer_method") || "3", 10);
        savedSchool = parseInt(localStorage.getItem("quran_prayer_school") || "0", 10);
        const rawManual = localStorage.getItem("quran_manual_location");
        if (rawManual) savedManual = JSON.parse(rawManual);
      } catch (e) {}

      swController.postMessage({
        type: "SAVE_PRAYER_CONFIG",
        timings: globalTimings,
        location: savedManual,
        method: savedMethod,
        school: savedSchool,
        remindersEnabled,
        prayerReminders,
        voice: azanVoice,
      });
    };

    syncSWConfig();

    if (swRegistration && "periodicSync" in swRegistration) {
      try {
        swRegistration.periodicSync.register("namaz-azan-sync", {
          minInterval: 12 * 60 * 60 * 1000,
        }).catch((e) => console.log("Periodic sync register notice:", e));
      } catch (e) {}
    }
  }, [remindersEnabled, prayerReminders, globalTimings, azanVoice, swRegistration]);

  const value = {
    user,
    isSyncedWithAccount,
    remindersEnabled,
    prayerReminders,
    reminderSound,
    azanVoice,
    isAzanPlaying,
    activeAzanPrayer,
    testAlarmTargetMs,
    changeAzanVoice,
    playAzanSound,
    stopAzanSound,
    testNotification,
    scheduleTestAlarm,
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
