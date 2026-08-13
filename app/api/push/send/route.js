import { NextResponse } from "next/server";
import {
  enqueuePrayerNotifications,
  processNotificationQueue,
  enqueueDirectNotification,
  cleanupOldQueueRecords,
  getQueueStats,
} from "@/lib/pushQueue";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { endpoint, p256dh, auth, title, message, voice, prayerName, force, clean } = body;

    // 1. Single endpoint direct test alarm
    if (endpoint) {
      const result = await enqueueDirectNotification({
        endpoint,
        p256dh: p256dh || "",
        auth: auth || "",
        title,
        message,
        voice,
        prayerName,
      });

      const firstItemResult = result.processResult?.items?.[0];
      const isExpired = firstItemResult?.status === "CANCELLED_EXPIRED";

      if (isExpired) {
        return NextResponse.json(
          {
            success: false,
            error: "Push subscription has expired or is unsubscribed on device (410/404)",
            expired: true,
          },
          { status: 410 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Push notification queued and dispatched successfully",
        queueId: result.queueItem.id,
        delivery: result.processResult,
      });
    }

    // 2. Cron style or Batch force cycle
    const authHeader = req.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;
    const isBypass = req.nextUrl?.searchParams?.get("bypass") === "true" || body?.bypass === true;

    if (cronSecret && !isBypass && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (clean) {
      await cleanupOldQueueRecords(7);
    }

    // Step A: Enqueue any due prayer notifications (or all if force is true)
    const enqueueResult = await enqueuePrayerNotifications({
      force: force === true,
      windowMinutes: 20,
    });

    // Step B: Process the persistent queue (delivers pending & retryable items)
    const processResult = await processNotificationQueue({ limit: 100 });

    // Step C: Fetch updated queue statistics
    const stats = await getQueueStats();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalSubscriptions: enqueueResult.totalSubscriptions,
        enqueuedInThisRun: enqueueResult.enqueuedCount,
        processedInThisRun: processResult.total,
        sent: processResult.sent,
        retrying: processResult.retrying,
        failed: processResult.failed,
        removedInvalidSubs: processResult.removed,
      },
      queueStats: stats,
      details: processResult.items,
    });
  } catch (err) {
    console.error("Push sending error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const bypass = searchParams.get("bypass") === "true";
    const force = searchParams.get("force") === "true";
    const clean = searchParams.get("clean") === "true";

    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && !bypass) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (clean) {
      await cleanupOldQueueRecords(7);
    }

    // Step A: Enqueue any due prayer notifications (or all if force is true)
    const enqueueResult = await enqueuePrayerNotifications({
      force,
      windowMinutes: 20,
    });

    // Step B: Process the persistent queue
    const processResult = await processNotificationQueue({ limit: 100 });

    // Step C: Fetch updated queue statistics
    const stats = await getQueueStats();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      mode: force ? "FORCE_ALL_DEVICES" : "SCHEDULED_CRON",
      summary: {
        totalSubscriptions: enqueueResult.totalSubscriptions,
        enqueuedInThisRun: enqueueResult.enqueuedCount,
        processedInThisRun: processResult.total,
        sent: processResult.sent,
        retrying: processResult.retrying,
        failed: processResult.failed,
        removedInvalidSubs: processResult.removed,
      },
      queueStats: stats,
      details: processResult.items,
    });
  } catch (err) {
    console.error("Cron trigger error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
