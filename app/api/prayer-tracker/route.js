import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Fetch all prayer logs for logged-in user
export async function GET(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await prisma.prayerLog.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    // Format into map object: { "YYYY-MM-DD": { Fajr: true, Dhuhr: true, ... } }
    const logsMap = {};
    logs.forEach((item) => {
      logsMap[item.date] = {
        Fajr: item.fajr,
        Dhuhr: item.dhuhr,
        Asr: item.asr,
        Maghrib: item.maghrib,
        Isha: item.isha,
      };
    });

    return NextResponse.json({ logs: logsMap });
  } catch (err) {
    console.error("GET /api/prayer-tracker error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Save or sync prayer logs for logged-in user
export async function POST(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, prayerName, completed, logsMap } = body;

    // Bulk sync payload: { logsMap: { "2026-08-08": { Fajr: true, Dhuhr: false... } } }
    if (logsMap && typeof logsMap === "object") {
      const dates = Object.keys(logsMap);
      const upsertPromises = dates.map((dStr) => {
        const dayData = logsMap[dStr] || {};
        return prisma.prayerLog.upsert({
          where: {
            userId_date: {
              userId,
              date: dStr,
            },
          },
          update: {
            fajr: !!dayData.Fajr,
            dhuhr: !!dayData.Dhuhr,
            asr: !!dayData.Asr,
            maghrib: !!dayData.Maghrib,
            isha: !!dayData.Isha,
          },
          create: {
            userId,
            date: dStr,
            fajr: !!dayData.Fajr,
            dhuhr: !!dayData.Dhuhr,
            asr: !!dayData.Asr,
            maghrib: !!dayData.Maghrib,
            isha: !!dayData.Isha,
          },
        });
      });

      await Promise.all(upsertPromises);
      return NextResponse.json({ success: true, count: dates.length });
    }

    // Single prayer toggle payload: { date: "YYYY-MM-DD", prayerName: "Fajr", completed: true }
    if (!date || !prayerName) {
      return NextResponse.json({ error: "Missing date or prayerName" }, { status: 400 });
    }

    const prayerKey = prayerName.toLowerCase();
    const validKeys = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
    if (!validKeys.includes(prayerKey)) {
      return NextResponse.json({ error: "Invalid prayerName" }, { status: 400 });
    }

    // Existing entry check
    const existing = await prisma.prayerLog.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    const isDone = typeof completed === "boolean" ? completed : existing ? !existing[prayerKey] : true;

    const updated = await prisma.prayerLog.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        [prayerKey]: isDone,
      },
      create: {
        userId,
        date,
        [prayerKey]: isDone,
      },
    });

    return NextResponse.json({
      success: true,
      log: {
        date: updated.date,
        Fajr: updated.fajr,
        Dhuhr: updated.dhuhr,
        Asr: updated.asr,
        Maghrib: updated.maghrib,
        Isha: updated.isha,
      },
    });
  } catch (err) {
    console.error("POST /api/prayer-tracker error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
