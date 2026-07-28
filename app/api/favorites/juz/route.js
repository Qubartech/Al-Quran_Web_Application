import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await prisma.favoriteJuz.findMany({
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
    const { juzId, juzName, startSurah, endSurah } = body;

    const favorite = await prisma.favoriteJuz.upsert({
      where: {
        userId_juzId: {
          userId,
          juzId: parseInt(juzId, 10),
        },
      },
      update: {},
      create: {
        userId,
        juzId: parseInt(juzId, 10),
        juzName: juzName || "",
        startSurah: startSurah || "",
        endSurah: endSurah || "",
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
    const juzId = searchParams.get("juzId");

    if (!juzId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await prisma.favoriteJuz.delete({
      where: {
        userId_juzId: {
          userId,
          juzId: parseInt(juzId, 10),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
