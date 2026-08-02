"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const PrayerTrackerContext = createContext(null);

export function usePrayerTracker() {
  return useContext(PrayerTrackerContext);
}

const STORAGE_KEY_SETTINGS = "quran_namaz_reminder_settings";
const STORAGE_KEY_LOGS = "quran_namaz_tracker_logs";

export function PrayerTrackerProvider({ children }) {
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

  // 3. Track last notified prayer to avoid duplicate alerts: { "2026-08-03_Fajr": true }
  const [notifiedMap, setNotifiedMap] = useState({});

  // Load saved settings & logs on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.remindersEnabled === "boolean") setRemindersEnabled(parsed.remindersEnabled);
        if (parsed.prayerReminders) setPrayerReminders(parsed.prayerReminders);
        if (typeof parsed.reminderSound === "boolean") setReminderSound(parsed.reminderSound);
      }

      const savedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
      if (savedLogs) {
        setCompletedLogs(JSON.parse(savedLogs));
      }
    } catch (e) {
      console.error("Failed to load prayer tracker data from localStorage:", e);
    }
  }, []);

  // Save settings helper
  const saveSettings = (newRemindersEnabled, newPrayerReminders, newSound) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({
          remindersEnabled: newRemindersEnabled,
          prayerReminders: newPrayerReminders,
          reminderSound: newSound,
        })
      );
    } catch (e) {
      console.error("Failed to save reminder settings:", e);
    }
  };

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
    
    setCompletedLogs((prev) => {
      const dayData = prev[targetDate] || {};
      const updatedDay = {
        ...dayData,
        [prayerName]: !dayData[prayerName],
      };

      const updatedLogs = {
        ...prev,
        [targetDate]: updatedDay,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updatedLogs));
        } catch (e) {
          console.error("Failed to save prayer logs:", e);
        }
      }

      return updatedLogs;
    });
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
