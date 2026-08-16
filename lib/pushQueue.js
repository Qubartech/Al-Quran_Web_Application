import prisma from "./prisma.js";
import webpush from "web-push";

// Configure web-push with VAPID details
function setupVapid() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:support@quranapp.com";
  if (publicKey && privateKey) {
    webpush.setVapidDetails(
      subject,
      publicKey,
      privateKey
    );
    return true;
  }
  return false;
}

// In-memory prayer timing cache (15-minute TTL)
const timingCache = new Map();

export async function fetchTimingsCached(city, country, method = 3, school = 0) {
  const cacheKey = `${city || "Dhaka"}_${country || "Bangladesh"}_${method}_${school}`;
  const now = Date.now();

  if (timingCache.has(cacheKey)) {
    const cached = timingCache.get(cacheKey);
    if (now - cached.timestamp < 15 * 60 * 1000) {
      return cached.data;
    }
  }

  try {
    let url = "";
    if (city) {
      const address = country ? `${city}, ${country}` : city;
      url = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(address)}&method=${method}&school=${school}`;
    } else {
      url = `https://api.aladhan.com/v1/timingsByAddress?address=Dhaka, Bangladesh&method=${method}&school=${school}`;
    }

    const res = await fetch(url, { next: { revalidate: 900 } });
    const data = await res.json();
    if (data && data.code === 200 && data.data) {
      const timings = data.data.timings;
      const timezone = data.data.meta?.timezone || "Asia/Dhaka";
      const payload = { timings, timezone };
      timingCache.set(cacheKey, { timestamp: now, data: payload });
      return payload;
    }
  } catch (e) {
    console.error(`Failed to fetch timings for ${cacheKey}:`, e.message);
  }
  return null;
}

/**
 * Calculates current time and today's date in a target timezone
 */
export function getLocalizedTime(timezone = "Asia/Dhaka") {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const year = parts.find((p) => p.type === "year")?.value || "2026";
    const month = parts.find((p) => p.type === "month")?.value || "01";
    const day = parts.find((p) => p.type === "day")?.value || "01";
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);

    return {
      dateStr: `${year}-${month}-${day}`,
      currentMinutes: hour * 60 + minute,
      hour,
      minute,
    };
  } catch (e) {
    const hour = now.getHours();
    const minute = now.getMinutes();
    return {
      dateStr: now.toISOString().split("T")[0],
      currentMinutes: hour * 60 + minute,
      hour,
      minute,
    };
  }
}

/**
 * 1. Enqueue due prayer notifications for all active subscriptions
 * Checks each subscription's timezone and timings.
 * If a prayer time has arrived within the window (or if force=true),
 * adds a PENDING notification into NotificationQueue if not already queued for today.
 */
export async function enqueuePrayerNotifications({ force = false, windowMinutes = 20 } = {}) {
  const subscriptions = await prisma.pushSubscription.findMany();
  const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  let enqueuedCount = 0;
  const skippedCount = 0;

  for (const sub of subscriptions) {
    try {
      if (force) {
        const testTimestamp = Date.now();
        const dedupKey = `test_${sub.id}_${testTimestamp}`;
        const voice = sub.voice || "makkah";
        const voiceTitle = voice === "madinah" ? "Madinah Azan" : voice === "fajr" ? "Fajr Azan" : voice === "chime" ? "Soft Chime" : "Makkah Azan";

        await prisma.notificationQueue.create({
          data: {
            subscriptionId: sub.id,
            userId: sub.userId,
            endpoint: sub.endpoint,
            p256dh: sub.p256dh,
            auth: sub.auth,
            prayerName: "Test",
            title: `🔔 Test Push Notification (${voiceTitle})`,
            body: `Background push & Azan notifications are active for ${sub.city || "your location"}!`,
            voice: voice,
            status: "PENDING",
            scheduledFor: new Date(),
            dedupKey: dedupKey,
            payload: JSON.stringify({
              title: `🔔 Test Push Notification (${voiceTitle})`,
              body: `Background push & Azan notifications are active for ${sub.city || "your location"}!`,
              voice: voice,
              prayerName: "Test",
              icon: "/icon-192.png",
              badge: "/badge-72.png",
              url: "/prayer",
              tag: `namaz-test-${dedupKey}`,
            }),
          },
        });
        enqueuedCount++;
        continue;
      }

      const timingData = await fetchTimingsCached(sub.city, sub.country, sub.method, sub.school);
      if (!timingData || !timingData.timings) continue;

      const { timings, timezone } = timingData;
      const { dateStr, currentMinutes } = getLocalizedTime(timezone);
      const activeReminders = (sub.reminders || "Fajr,Dhuhr,Asr,Maghrib,Isha").split(",").map((s) => s.trim());

      for (const prayerName of corePrayers) {
        if (!activeReminders.includes(prayerName)) continue;

        const prayerTimeRaw = timings[prayerName];
        if (!prayerTimeRaw) continue;

        const cleanPrayerTime = prayerTimeRaw.split(" ")[0]; // "04:13"
        const [pHourStr, pMinStr] = cleanPrayerTime.split(":");
        const prayerMinutes = parseInt(pHourStr, 10) * 60 + parseInt(pMinStr, 10);
        const diffMinutes = currentMinutes - prayerMinutes;

        // Due condition: prayer time arrived within the last windowMinutes (e.g. 0 to 20 mins ago)
        if (diffMinutes >= 0 && diffMinutes <= windowMinutes) {
          const dedupKey = `sub_${sub.id}_${prayerName}_${dateStr}`;

          // Check if already notified on subscription or already exists in queue
          if (sub.lastNotified === `${dateStr}_${prayerName}`) {
            continue;
          }

          const existingQueue = await prisma.notificationQueue.findFirst({
            where: {
              dedupKey: dedupKey,
              status: { in: ["PENDING", "PROCESSING", "SENT", "RETRYING"] },
            },
          });

          if (existingQueue) {
            continue;
          }

          const voice = sub.voice || "makkah";
          const voiceTitle = voice === "madinah" ? "Madinah Azan" : voice === "fajr" ? "Fajr Azan" : voice === "chime" ? "Soft Chime" : "Makkah Azan";
          const title = `🕌 Time for ${prayerName} Prayer! (${voiceTitle})`;
          const body = `It is now time for ${prayerName} Salah in ${sub.city || "your location"}. May Allah accept your prayers!`;

          await prisma.notificationQueue.create({
            data: {
              subscriptionId: sub.id,
              userId: sub.userId,
              endpoint: sub.endpoint,
              p256dh: sub.p256dh,
              auth: sub.auth,
              prayerName: prayerName,
              title,
              body,
              voice,
              status: "PENDING",
              scheduledFor: new Date(),
              dedupKey: dedupKey,
              payload: JSON.stringify({
                title,
                body,
                voice,
                prayerName,
                icon: "/icon-192.png",
                badge: "/badge-72.png",
                url: "/prayer",
                tag: `namaz-notification-${prayerName}-${dateStr}`,
              }),
            },
          });

          enqueuedCount++;
        }
      }
    } catch (subErr) {
      console.error(`Error enqueuing for subscription ${sub.id}:`, subErr.message);
    }
  }

  return { enqueuedCount, totalSubscriptions: subscriptions.length };
}

/**
 * 2. Process Notification Queue
 * Fetches all PENDING and RETRYING items that are due and attempts delivery via webpush.
 * Handles automatic retries with exponential backoff on failure,
 * and removes dead subscriptions (HTTP 410/404).
 */
export async function processNotificationQueue({ limit = 50 } = {}) {
  setupVapid();

  const now = new Date();

  // Find all queue items ready for processing
  const queueItems = await prisma.notificationQueue.findMany({
    where: {
      status: { in: ["PENDING", "RETRYING"] },
      scheduledFor: { lte: now },
      OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: now } }],
      attempts: { lt: 5 },
    },
    take: limit,
    orderBy: { createdAt: "asc" },
  });

  const results = {
    total: queueItems.length,
    sent: 0,
    retrying: 0,
    failed: 0,
    removed: 0,
    items: [],
  };

  const backoffDelays = [30, 60, 120, 300, 600]; // in seconds

  for (const item of queueItems) {
    // Mark item as PROCESSING
    await prisma.notificationQueue.update({
      where: { id: item.id },
      data: { status: "PROCESSING" },
    }).catch(() => {});

    const pushSubscription = {
      endpoint: item.endpoint,
      keys: {
        p256dh: item.p256dh,
        auth: item.auth,
      },
    };

    let payloadString = item.payload;
    if (!payloadString) {
      payloadString = JSON.stringify({
        title: item.title,
        body: item.body,
        voice: item.voice,
        prayerName: item.prayerName,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        url: "/prayer",
        tag: `namaz-${item.prayerName}-${item.id.slice(0, 8)}`,
      });
    }

    try {
      const pushOptions = {
        TTL: 86400, // 24 hours
        urgency: "high", // Critical for Android FCM & Apple APNs to wake sleeping mobile devices
        topic: item.prayerName && item.prayerName !== "Test" ? `namaz-${item.prayerName.toLowerCase()}` : "namaz-alert",
      };

      await webpush.sendNotification(pushSubscription, payloadString, pushOptions);

      // SUCCESS: Mark as SENT
      await prisma.notificationQueue.update({
        where: { id: item.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
          lastError: null,
          attempts: item.attempts + 1,
        },
      });

      // Update PushSubscription lastNotified if applicable
      if (item.subscriptionId && item.prayerName !== "Test") {
        const todayStr = new Date().toISOString().split("T")[0];
        await prisma.pushSubscription.update({
          where: { id: item.subscriptionId },
          data: { lastNotified: `${todayStr}_${item.prayerName}` },
        }).catch(() => {});
      }

      results.sent++;
      results.items.push({
        id: item.id,
        prayer: item.prayerName,
        status: "SENT",
        endpoint: item.endpoint.slice(0, 35) + "...",
      });
    } catch (err) {
      const statusCode = err.statusCode || err.status || 0;
      const errorMessage = err.message || "Unknown push delivery error";

      if (statusCode === 410 || statusCode === 404) {
        // SUBSCRIPTION EXPIRED / REVOKED
        await prisma.notificationQueue.update({
          where: { id: item.id },
          data: {
            status: "CANCELLED",
            lastError: `Subscription expired or unregistered (HTTP ${statusCode})`,
            attempts: item.attempts + 1,
          },
        }).catch(() => {});

        // Delete invalid subscription from database to clean up
        await prisma.pushSubscription.deleteMany({
          where: { endpoint: item.endpoint },
        }).catch(() => {});

        results.removed++;
        results.items.push({
          id: item.id,
          prayer: item.prayerName,
          status: "CANCELLED_EXPIRED",
          error: `HTTP ${statusCode}`,
        });
      } else {
        // TRANSIENT ERROR: Schedule Retry
        const newAttempts = item.attempts + 1;
        const maxAttempts = item.maxAttempts || 5;

        if (newAttempts < maxAttempts) {
          const delaySec = backoffDelays[newAttempts - 1] || 300;
          const nextRetry = new Date(Date.now() + delaySec * 1000);

          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: {
              status: "RETRYING",
              attempts: newAttempts,
              nextRetryAt: nextRetry,
              lastError: `${errorMessage} (Status: ${statusCode || "N/A"})`,
            },
          }).catch(() => {});

          results.retrying++;
          results.items.push({
            id: item.id,
            prayer: item.prayerName,
            status: "RETRYING",
            attempt: newAttempts,
            nextRetryInSec: delaySec,
            error: errorMessage,
          });
        } else {
          // EXCEEDED MAX ATTEMPTS: Mark FAILED
          await prisma.notificationQueue.update({
            where: { id: item.id },
            data: {
              status: "FAILED",
              attempts: newAttempts,
              lastError: `Max retries (${maxAttempts}) exceeded: ${errorMessage}`,
            },
          }).catch(() => {});

          results.failed++;
          results.items.push({
            id: item.id,
            prayer: item.prayerName,
            status: "FAILED",
            attempt: newAttempts,
            error: errorMessage,
          });
        }
      }
    }
  }

  return results;
}

/**
 * 3. Enqueue and dispatch a direct single-device push notification (for UI test or manual triggers)
 */
export async function enqueueDirectNotification({
  endpoint,
  p256dh,
  auth,
  userId = null,
  title,
  message,
  voice = "makkah",
  prayerName = "Test",
}) {
  setupVapid();

  const voiceTitle = voice === "madinah" ? "Madinah Azan" : voice === "fajr" ? "Fajr Azan" : voice === "chime" ? "Soft Chime" : "Makkah Azan";
  const pushTitle = title || `🔔 Test Push Notification (${voiceTitle})`;
  const pushBody = message || `Background push notification delivered from server!`;

  const queueItem = await prisma.notificationQueue.create({
    data: {
      userId: userId || null,
      endpoint,
      p256dh,
      auth,
      prayerName,
      title: pushTitle,
      body: pushBody,
      voice,
      status: "PENDING",
      scheduledFor: new Date(),
      dedupKey: `direct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      payload: JSON.stringify({
        title: pushTitle,
        body: pushBody,
        voice,
        prayerName,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        url: "/prayer",
        tag: `namaz-direct-${Date.now()}`,
      }),
    },
  });

  // Process the queue immediately to deliver this item
  const processResult = await processNotificationQueue({ limit: 10 });
  return { queueItem, processResult };
}

/**
 * 4. Cleanup old completed and cancelled queue records (older than 7 days)
 */
export async function cleanupOldQueueRecords(daysToKeep = 7) {
  const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  const deleted = await prisma.notificationQueue.deleteMany({
    where: {
      status: { in: ["SENT", "CANCELLED", "FAILED"] },
      createdAt: { lt: cutoff },
    },
  });
  return deleted.count;
}

/**
 * 5. Get current queue diagnostic statistics
 */
export async function getQueueStats() {
  const counts = await prisma.notificationQueue.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const totalSubs = await prisma.pushSubscription.count();

  const stats = {
    totalSubscriptions: totalSubs,
    queue: {
      PENDING: 0,
      PROCESSING: 0,
      RETRYING: 0,
      SENT: 0,
      FAILED: 0,
      CANCELLED: 0,
      TOTAL: 0,
    },
  };

  counts.forEach((c) => {
    stats.queue[c.status] = c._count.id;
    stats.queue.TOTAL += c._count.id;
  });

  return stats;
}
