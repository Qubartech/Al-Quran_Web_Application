import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { subscription, userId, city, country, method, school, voice, reminders } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Missing subscription info" }, { status: 400 });
    }

    const keys = subscription.keys || {};
    const p256dh = keys.p256dh || "";
    const auth = keys.auth || "";

    const saved = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: userId || null,
        p256dh,
        auth,
        city: city || null,
        country: country || null,
        method: typeof method === "number" ? method : 3,
        school: typeof school === "number" ? school : 0,
        voice: voice || "makkah",
        reminders: reminders || "Fajr,Dhuhr,Asr,Maghrib,Isha",
      },
      create: {
        userId: userId || null,
        endpoint: subscription.endpoint,
        p256dh,
        auth,
        city: city || null,
        country: country || null,
        method: typeof method === "number" ? method : 3,
        school: typeof school === "number" ? school : 0,
        voice: voice || "makkah",
        reminders: reminders || "Fajr,Dhuhr,Asr,Maghrib,Isha",
      },
    });

    return NextResponse.json({ success: true, id: saved.id });
  } catch (err) {
    console.error("Subscription save error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }
    await prisma.pushSubscription.deleteMany({
      where: { endpoint },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
