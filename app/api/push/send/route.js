import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import webpush from "web-push";

// Configure web-push with VAPID details
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:support@quranapp.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Fetch prayer timings with caching for identical address/config
const timingCache = new Map();
async function fetchTimingsCached(city, country, method, school) {
  const cacheKey = `${city || "Dhaka"}_${country || ""}_${method}_${school}`;
  const now = Date.now();

  if (timingCache.has(cacheKey)) {
    const cached = timingCache.get(cacheKey);
    if (now - cached.timestamp < 15 * 60 * 1000) { // 15 mins cache
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

    const res = await fetch(url);
    const data = await res.json();
    if (data && data.code === 200 && data.data) {
      const timings = data.data.timings;
      const timezone = data.data.meta?.timezone || "Asia/Dhaka";
      const payload = { timings, timezone };
      timingCache.set(cacheKey, { timestamp: now, data: payload });
      return payload;
    }
  } catch (e) {
    console.error(`Failed to fetch timings for ${cacheKey}:`, e);
  }
  return null;
}

// Core push loop scheduler
async function runCronPushCycle(force = false) {
  const subscriptions = await prisma.pushSubscription.findMany();
  const results = { total: subscriptions.length, sent: 0, failed: 0, removed: 0 };
  const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (const sub of subscriptions) {
    try {
      if (force) {
        const notifyKey = `${new Date().toISOString().split("T")[0]}_test`;

        const pushSub = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        const payload = JSON.stringify({
          title: `Test Push Notification`,
          body: `Background push notifications are working for ${sub.city || "your location"}!`,
          voice: sub.voice,
          prayerName: "Test",
          tag: `namaz-test-${notifyKey}-${sub.id.slice(0, 5)}`,
        });

        await webpush.sendNotification(pushSub, payload);
        results.sent++;
        continue;
      }
      const apiData = await fetchTimingsCached(sub.city, sub.country, sub.method, sub.school);
      if (!apiData) continue;

      const { timings, timezone } = apiData;

      // Calculate current date, hour, and minute in the subscriber's specific timezone
      const now = new Date();
      let userHourStr = "";
      let userMinStr = "";
      let userDateStr = "";

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
        const year = parts.find((p) => p.type === "year").value;
        const month = parts.find((p) => p.type === "month").value;
        const day = parts.find((p) => p.type === "day").value;
        userHourStr = parts.find((p) => p.type === "hour").value;
        userMinStr = parts.find((p) => p.type === "minute").value;
        userDateStr = `${year}-${month}-${day}`;
      } catch (e) {
        userHourStr = String(now.getHours()).padStart(2, "0");
        userMinStr = String(now.getMinutes()).padStart(2, "0");
        userDateStr = now.toISOString().split("T")[0];
      }

      const currentMinutes = parseInt(userHourStr, 10) * 60 + parseInt(userMinStr, 10);
      const activeReminders = sub.reminders.split(",");

      for (const prayerName of corePrayers) {
        if (!activeReminders.includes(prayerName)) continue;

        const prayerTimeRaw = timings[prayerName];
        if (!prayerTimeRaw) continue;

        const cleanPrayerTime = prayerTimeRaw.split(" ")[0]; // "13:20"
        const [pHourStr, pMinStr] = cleanPrayerTime.split(":");
        const prayerMinutes = parseInt(pHourStr, 10) * 60 + parseInt(pMinStr, 10);

        const diffMinutes = currentMinutes - prayerMinutes;

        // Check if the prayer time arrived in the last 6 minutes (safely matches GitHub Actions 5-min cron scheduler)
        if (diffMinutes >= 0 && diffMinutes < 6) {
          const notifyKey = `${userDateStr}_${prayerName}`;

          // Avoid duplicate notifications if triggered multiple times within the 6-min window
          if (sub.lastNotified === notifyKey) {
            continue;
          }

          const pushSub = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          const payload = JSON.stringify({
            title: `Time for ${prayerName} Prayer!`,
            body: `It is now time for ${prayerName} Salah in ${sub.city || "your location"}. May Allah accept your prayers!`,
            voice: sub.voice,
            prayerName: prayerName,
            tag: `namaz-notification-${prayerName}-${userDateStr}`,
          });

          await webpush.sendNotification(pushSub, payload);

          // Update DB immediately to record notification and block duplication
          await prisma.pushSubscription.update({
            where: { id: sub.id },
            data: { lastNotified: notifyKey },
          });

          results.sent++;
        }
      }
    } catch (err) {
      results.failed++;
      if (err.statusCode === 410 || err.statusCode === 404) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
        results.removed++;
      } else {
        console.error(`Failed to push to sub ${sub.id}:`, err);
      }
    }
  }

  return results;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { endpoint, p256dh, auth, title, message, voice, prayerName } = body;

    // A. Single endpoint immediate test alarm
    if (endpoint) {
      const pushSubscription = {
        endpoint,
        keys: {
          p256dh: p256dh,
          auth: auth,
        },
      };

      const payload = JSON.stringify({
        title: title || `Time for Prayer!`,
        body: message || `It is now time for prayer. May Allah accept your prayers!`,
        voice: voice || "makkah",
        prayerName: prayerName || "Namaz",
        tag: `namaz-${Date.now()}`,
      });

      try {
        await webpush.sendNotification(pushSubscription, payload);
        return NextResponse.json({ success: true, message: "Push sent successfully" });
      } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Delete from database since it is expired or unsubscribed
          await prisma.pushSubscription.delete({ where: { endpoint } }).catch(() => {});
          return NextResponse.json(
            { error: "Push subscription has expired or is unsubscribed", expired: true },
            { status: 410 }
          );
        }
        throw err;
      }
    }

    // B. Cron style processing for all active subscriptions
    const authHeader = req.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await runCronPushCycle(body?.force === true);
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Push sending error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Support GET for testing or simple cron triggers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bypass = searchParams.get("bypass") === "true";
    const force = searchParams.get("force") === "true";

    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && !bypass) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const results = await runCronPushCycle(force);
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Cron trigger error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
