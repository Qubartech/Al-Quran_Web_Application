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
    const p256dh = typeof keys.p256dh === "string" ? keys.p256dh : "";
    const auth = typeof keys.auth === "string" ? keys.auth : "";

    // Sanitize city and country to strictly be String or null
    let safeCity = null;
    let safeCountry = null;

    if (typeof city === "string") {
      safeCity = city.trim();
    } else if (typeof city === "object" && city !== null) {
      safeCity = typeof city.city === "string" ? city.city.trim() : null;
      if (!safeCountry && typeof city.country === "string") {
        safeCountry = city.country.trim();
      }
    }

    if (typeof country === "string") {
      safeCountry = country.trim();
    } else if (typeof country === "object" && country !== null) {
      safeCountry = typeof country.country === "string" ? country.country.trim() : null;
    }

    const saved = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: typeof userId === "string" ? userId : null,
        p256dh,
        auth,
        city: safeCity || null,
        country: safeCountry || null,
        method: typeof method === "number" ? method : 3,
        school: typeof school === "number" ? school : 0,
        voice: typeof voice === "string" ? voice : "makkah",
        reminders: typeof reminders === "string" ? reminders : "Fajr,Dhuhr,Asr,Maghrib,Isha",
      },
      create: {
        userId: typeof userId === "string" ? userId : null,
        endpoint: subscription.endpoint,
        p256dh,
        auth,
        city: safeCity || null,
        country: safeCountry || null,
        method: typeof method === "number" ? method : 3,
        school: typeof school === "number" ? school : 0,
        voice: typeof voice === "string" ? voice : "makkah",
        reminders: typeof reminders === "string" ? reminders : "Fajr,Dhuhr,Asr,Maghrib,Isha",
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
    console.error("Subscription delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
