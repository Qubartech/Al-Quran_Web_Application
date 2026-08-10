// Service Worker for Quran Application - Namaz Background Azan Notifications

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

let scheduledTimers = [];

function clearScheduledTimers() {
  scheduledTimers.forEach((timerId) => clearTimeout(timerId));
  scheduledTimers = [];
}

self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  if (data.type === "SCHEDULE_PRAYERS" && Array.isArray(data.prayers)) {
    clearScheduledTimers();
    const now = Date.now();

    data.prayers.forEach((prayer) => {
      const delay = prayer.timeMs - now;
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        const timerId = setTimeout(() => {
          showPrayerNotification(prayer.name, prayer.voice);
        }, delay);
        scheduledTimers.push(timerId);
      }
    });
  } else if (data.type === "TRIGGER_NOTIFICATION" && data.prayerName) {
    showPrayerNotification(data.prayerName, data.voice);
  }
});

function showPrayerNotification(prayerName, voice) {
  const title = `Time for ${prayerName} Prayer! (Azan)`;
  const options = {
    body: `It is now time for ${prayerName} Salah. Listen to the Azan and prepare for prayer!`,
    icon: "/quran.svg",
    badge: "/quran.svg",
    vibrate: [500, 200, 500, 200, 500],
    data: { url: "/prayer" },
    tag: `namaz-notification-${prayerName}`,
    renotify: true,
    requireInteraction: true,
  };

  self.registration.showNotification(title, options);
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || "/prayer";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
