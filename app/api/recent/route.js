import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const recents = await prisma.recentSurah.findMany({
      where: { userId },
      orderBy: { playedAt: "desc" },
      take: 5,
    });
    return NextResponse.json(recents);
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
    const { surahNumber, surahName, englishName } = body;

    const recent = await prisma.recentSurah.upsert({
      where: {
        userId_surahNumber: {
          userId,
          surahNumber: parseInt(surahNumber, 10),
        },
      },
      update: {
        playedAt: new Date(),
      },
      create: {
        userId,
        surahNumber: parseInt(surahNumber, 10),
        surahName: surahName || "",
        englishName: englishName || "",
      },
    });

    return NextResponse.json(recent);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
