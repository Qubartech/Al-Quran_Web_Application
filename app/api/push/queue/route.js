import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  processNotificationQueue,
  cleanupOldQueueRecords,
  getQueueStats,
} from "@/lib/pushQueue";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const status = searchParams.get("status");

    const where = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    const [stats, items, subscriptionsCount] = await Promise.all([
      getQueueStats(),
      prisma.notificationQueue.findMany({
        where,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          subscriptionId: true,
          prayerName: true,
          title: true,
          body: true,
          voice: true,
          status: true,
          attempts: true,
          maxAttempts: true,
          lastError: true,
          scheduledFor: true,
          nextRetryAt: true,
          sentAt: true,
          dedupKey: true,
          createdAt: true,
          updatedAt: true,
          endpoint: true,
        },
      }),
      prisma.pushSubscription.count(),
    ]);

    // Mask endpoints for security
    const sanitizedItems = items.map((i) => ({
      ...i,
      endpoint: i.endpoint ? `${i.endpoint.slice(0, 30)}...${i.endpoint.slice(-15)}` : null,
    }));

    return NextResponse.json({
      success: true,
      stats,
      activeSubscriptions: subscriptionsCount,
      recentItems: sanitizedItems,
    });
  } catch (err) {
    console.error("Queue query error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, id } = body;

    // Action 1: Process queue immediately
    if (action === "process") {
      const result = await processNotificationQueue({ limit: 100 });
      const stats = await getQueueStats();
      return NextResponse.json({ success: true, result, stats });
    }

    // Action 2: Retry failed items
    if (action === "retry_failed") {
      const updated = await prisma.notificationQueue.updateMany({
        where: { status: "FAILED" },
        data: {
          status: "PENDING",
          attempts: 0,
          nextRetryAt: null,
          lastError: null,
        },
      });
      const result = await processNotificationQueue({ limit: 100 });
      return NextResponse.json({
        success: true,
        message: `Reset and retried ${updated.count} failed items`,
        result,
      });
    }

    // Action 3: Retry specific queue item by ID
    if (action === "retry_item" && id) {
      await prisma.notificationQueue.update({
        where: { id },
        data: {
          status: "PENDING",
          attempts: 0,
          nextRetryAt: null,
          lastError: null,
        },
      });
      const result = await processNotificationQueue({ limit: 10 });
      return NextResponse.json({ success: true, message: `Retried queue item ${id}`, result });
    }

    // Action 4: Cleanup old records
    if (action === "cleanup") {
      const days = parseInt(body.days || "7", 10);
      const deletedCount = await cleanupOldQueueRecords(days);
      return NextResponse.json({ success: true, message: `Cleaned up ${deletedCount} old records` });
    }

    return NextResponse.json({ error: "Invalid action. Supported: 'process', 'retry_failed', 'retry_item', 'cleanup'" }, { status: 400 });
  } catch (err) {
    console.error("Queue management error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
