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
    const progress = await prisma.learnProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(progress);
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
    const { moduleId, completed = true, quizScore = null, maxScore = null } = body;

    if (!moduleId) {
      return NextResponse.json({ error: "Missing moduleId" }, { status: 400 });
    }

    const progress = await prisma.learnProgress.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId,
        },
      },
      update: {
        completed: completed,
        ...(quizScore !== null ? { quizScore } : {}),
        ...(maxScore !== null ? { maxScore } : {}),
      },
      create: {
        userId,
        moduleId,
        completed: completed,
        quizScore,
        maxScore,
      },
    });

    return NextResponse.json(progress);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
