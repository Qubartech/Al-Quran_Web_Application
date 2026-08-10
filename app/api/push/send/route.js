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
      return cached.timings;
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
    if (data && data.code === 200 && data.data?.timings) {
      const timings = data.data.timings;
      timingCache.set(cacheKey, { timestamp: now, timings });
      return timings;
    }
  } catch (e) {
    console.error(`Failed to fetch timings for ${cacheKey}:`, e);
  }
  return null;
}

// Core push loop scheduler
async function runCronPushCycle() {
  const subscriptions = await prisma.pushSubscription.findMany();
  const results = { total: subscriptions.length, sent: 0, failed: 0, removed: 0 };
  const corePrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  for (const sub of subscriptions) {
    try {
      const timings = await fetchTimingsCached(sub.city, sub.country, sub.method, sub.school);
      if (!timings) continue;

      const now = new Date();
      const hour = String(now.getHours()).padStart(2, "0");
      const minute = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${hour}:${minute}`;

      const activeReminders = sub.reminders.split(",");

      for (const prayerName of corePrayers) {
        if (!activeReminders.includes(prayerName)) continue;

        const prayerTimeRaw = timings[prayerName];
        if (!prayerTimeRaw) continue;

        const cleanPrayerTime = prayerTimeRaw.split(" ")[0]; // "13:20"

        if (currentTimeStr === cleanPrayerTime) {
          const pushSub = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          const payload = JSON.stringify({
            title: `Time for ${prayerName} Prayer!`,
            body: `It is now time for ${prayerName} Salah in ${sub.city || "your location"}.`,
            voice: sub.voice,
            prayerName: prayerName,
            tag: `namaz-notification-${prayerName}-${Date.now()}`,
          });

          await webpush.sendNotification(pushSub, payload);
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

      await webpush.sendNotification(pushSubscription, payload);
      return NextResponse.json({ success: true, message: "Push sent successfully" });
    }

    // B. Cron style processing for all active subscriptions
    const authHeader = req.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await runCronPushCycle();
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

    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && !bypass) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const results = await runCronPushCycle();
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Cron trigger error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
