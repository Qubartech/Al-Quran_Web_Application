import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await prisma.favoriteAyah.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favorites);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { surahNumber, ayahNumber, surahName, arabicText, translation } = body;

    const favorite = await prisma.favoriteAyah.upsert({
      where: {
        userId_surahNumber_ayahNumber: {
          userId,
          surahNumber: parseInt(surahNumber, 10),
          ayahNumber: parseInt(ayahNumber, 10),
        },
      },
      update: {},
      create: {
        userId,
        surahNumber: parseInt(surahNumber, 10),
        ayahNumber: parseInt(ayahNumber, 10),
        surahName: surahName || "",
        arabicText: arabicText || "",
        translation: translation || "",
      },
    });

    return NextResponse.json(favorite);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const surahNumber = searchParams.get("surahNumber");
    const ayahNumber = searchParams.get("ayahNumber");

    if (!surahNumber || !ayahNumber) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await prisma.favoriteAyah.delete({
      where: {
        userId_surahNumber_ayahNumber: {
          userId,
          surahNumber: parseInt(surahNumber, 10),
          ayahNumber: parseInt(ayahNumber, 10),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
