// Service Worker for Quran Application - Namaz Persistent Background Notifications & Custom Test Alarms

const DB_NAME = "QuranNamazSWDB";
const DB_VERSION = 1;
const STORE_CONFIG = "config";
const STORE_NOTIFIED = "notified";

let activeTimers = [];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await checkAndScheduleBackgroundNotifications();
    })()
  );
});

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_CONFIG)) {
        db.createObjectStore(STORE_CONFIG);
      }
      if (!db.objectStoreNames.contains(STORE_NOTIFIED)) {
        db.createObjectStore(STORE_NOTIFIED);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getDBValue(storeName, key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function setDBValue(storeName, key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

function clearActiveTimers() {
  activeTimers.forEach((t) => clearTimeout(t));
  activeTimers = [];
}

async function checkAndScheduleBackgroundNotifications() {
  clearActiveTimers();

  // 1. Check custom user test alarm
  const testAlarm = await getDBValue(STORE_CONFIG, "active_test_alarm");
  if (testAlarm && testAlarm.timeMs) {
    const nowMs = Date.now();
    const diffMs = nowMs - testAlarm.timeMs;
    const notifyKey = `test_alarm_${testAlarm.timeMs}`;
    const alreadyNotified = await getDBValue(STORE_NOTIFIED, notifyKey);

    if (diffMs >= 0 && diffMs <= 10 * 60 * 1000 && !alreadyNotified) {
      await setDBValue(STORE_NOTIFIED, notifyKey, true);
      await setDBValue(STORE_CONFIG, "active_test_alarm", null);
      showPrayerNotification(testAlarm.label || "Closed-Tab Test Azan", testAlarm.voice);
    } else if (diffMs < 0) {
      const delay = Math.abs(diffMs);
      const timerId = setTimeout(async () => {
        const reCheck = await getDBValue(STORE_NOTIFIED, notifyKey);
        if (!reCheck) {
          await setDBValue(STORE_NOTIFIED, notifyKey, true);
          await setDBValue(STORE_CONFIG, "active_test_alarm", null);
          showPrayerNotification(testAlarm.label || "Closed-Tab Test Azan", testAlarm.voice);
        }
      }, delay);
      activeTimers.push(timerId);
    }
  }

  // 2. Check daily prayer timings
  const config = await getDBValue(STORE_CONFIG, "user_namaz_config");
  if (!config || !config.remindersEnabled) return;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  let timings = config.timings;

  if (!timings || config.date !== todayStr) {
    try {
      let url = "";
      const method = config.method || 3;
      const school = config.school || 0;
      const loc = config.location;

      if (loc && loc.isGps && loc.latitude && loc.longitude) {
        url = `https://api.aladhan.com/v1/timings?latitude=${loc.latitude}&longitude=${loc.longitude}&method=${method}&school=${school}`;
      } else if (loc && loc.city) {
        const query = loc.country ? `${loc.city}, ${loc.country}` : loc.city;
        url = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(query)}&method=${method}&school=${school}`;
      } else {
        url = `https://api.aladhan.com/v1/timingsByAddress?address=Dhaka, Bangladesh&method=${method}&school=${school}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data && data.code === 200 && data.data?.timings) {
        timings = data.data.timings;
        config.timings = timings;
        config.date = todayStr;
        await setDBValue(STORE_CONFIG, "user_namaz_config", config);
      }
    } catch (e) {
      console.error("SW failed to fetch prayer timings in background:", e);
    }
  }

  if (!timings) return;

  const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const prayerReminders = config.prayerReminders || {};

  for (const prayerName of corePrayers) {
    if (prayerReminders[prayerName] === false) continue;

    const timeVal = timings[prayerName];
    if (!timeVal) continue;

    const cleanTime = timeVal.split(" ")[0];
    const [hStr, mStr] = cleanTime.split(":");
    if (!hStr || !mStr) continue;

    const prayerDate = new Date(now);
    prayerDate.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);

    const diffMs = now.getTime() - prayerDate.getTime();
    const notifyKey = `${todayStr}_${prayerName}`;
    const alreadyNotified = await getDBValue(STORE_NOTIFIED, notifyKey);

    if (diffMs >= 0 && diffMs <= 15 * 60 * 1000) {
      if (!alreadyNotified) {
        await setDBValue(STORE_NOTIFIED, notifyKey, true);
        showPrayerNotification(prayerName, config.voice);
      }
    } else if (diffMs < 0) {
      const delay = Math.abs(diffMs);
      if (delay < 24 * 60 * 60 * 1000) {
        const timerId = setTimeout(async () => {
          const reCheckNotified = await getDBValue(STORE_NOTIFIED, notifyKey);
          if (!reCheckNotified) {
            await setDBValue(STORE_NOTIFIED, notifyKey, true);
            showPrayerNotification(prayerName, config.voice);
          }
        }, delay);
        activeTimers.push(timerId);
      }
    }
  }
}

function showPrayerNotification(prayerName, voice) {
  const voiceTitle = voice === "madinah" ? "Madinah Azan" : voice === "fajr" ? "Fajr Azan" : voice === "chime" ? "Soft Chime" : "Makkah Azan";
  const title = `Time for ${prayerName}! (${voiceTitle})`;
  const options = {
    body: `It is now time for ${prayerName}. Background notifications & Azan alerts are working!`,
    icon: "/quran.svg",
    badge: "/quran.svg",
    vibrate: [500, 200, 500, 200, 500],
    data: { url: "/prayer" },
    tag: `namaz-notification-${prayerName}-${Date.now()}`,
    renotify: true,
    requireInteraction: true,
  };

  self.registration.showNotification(title, options);
}

self.addEventListener("message", async (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "SCHEDULE_TEST_ALARM" && data.testTimeMs) {
    const testItem = {
      timeMs: data.testTimeMs,
      label: data.label || "Closed-Tab Test Azan",
      voice: data.voice || "makkah",
    };
    await setDBValue(STORE_CONFIG, "active_test_alarm", testItem);
    await checkAndScheduleBackgroundNotifications();
  } else if (data.type === "SAVE_PRAYER_CONFIG") {
    const configPayload = {
      date: new Date().toISOString().split("T")[0],
      timings: data.timings,
      location: data.location,
      method: data.method || 3,
      school: data.school || 0,
      remindersEnabled: data.remindersEnabled,
      prayerReminders: data.prayerReminders,
      voice: data.voice || "makkah",
    };

    await setDBValue(STORE_CONFIG, "user_namaz_config", configPayload);
    await checkAndScheduleBackgroundNotifications();
  } else if (data.type === "SCHEDULE_PRAYERS" && Array.isArray(data.prayers)) {
    await checkAndScheduleBackgroundNotifications();
  } else if (data.type === "TRIGGER_NOTIFICATION" && data.prayerName) {
    showPrayerNotification(data.prayerName, data.voice);
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "namaz-azan-sync" || event.tag === "prayer-notifications") {
    event.waitUntil(checkAndScheduleBackgroundNotifications());
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "namaz-azan-sync" || event.tag === "prayer-notifications") {
    event.waitUntil(checkAndScheduleBackgroundNotifications());
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const nd = event.notification.data || {};
  let targetUrl = nd.url || "/prayer";

  if (nd.autoPlay && nd.prayerName && nd.voice) {
    targetUrl = `/prayer?playAzan=true&prayer=${encodeURIComponent(nd.prayerName)}&voice=${encodeURIComponent(nd.voice)}`;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/prayer") && "focus" in client) {
          if ("navigate" in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle incoming Web Push notifications from server
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Time for Prayer!", body: event.data.text() };
    }
  }

  const title = data.title || "Time for Prayer!";
  const voice = data.voice || "makkah";
  const prayerName = data.prayerName || "Namaz";
  const voiceTitle = voice === "madinah" ? "Madinah Azan" : voice === "fajr" ? "Fajr Azan" : voice === "chime" ? "Soft Chime" : "Makkah Azan";

  const options = {
    body: data.body || `It is now time for ${prayerName}. May Allah accept your prayers!`,
    icon: "/quran.svg",
    badge: "/quran.svg",
    vibrate: [500, 200, 500, 200, 500],
    tag: data.tag || `namaz-push-${Date.now()}`,
    renotify: true,
    data: { 
      url: "/prayer",
      autoPlay: true,
      prayerName,
      voice
    },
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
