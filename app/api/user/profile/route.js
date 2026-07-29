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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return NextResponse.json(user || {});
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, birthdate, preferredReciter, preferredTranslation, dailyGoal, email } = body;

    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        ...(name !== undefined ? { name } : {}),
        ...(birthdate !== undefined ? { birthdate: birthdate ? new Date(birthdate) : null } : {}),
        ...(preferredReciter !== undefined ? { preferredReciter } : {}),
        ...(preferredTranslation !== undefined ? { preferredTranslation } : {}),
        ...(dailyGoal !== undefined ? { dailyGoal: parseInt(dailyGoal, 10) } : {}),
        ...(email !== undefined ? { email } : {}),
      },
      create: {
        id: userId,
        email: email || null,
        name: name || null,
        birthdate: birthdate ? new Date(birthdate) : null,
        preferredReciter: preferredReciter || "mishari_al_afasy",
        preferredTranslation: preferredTranslation || "sahih_international",
        dailyGoal: dailyGoal ? parseInt(dailyGoal, 10) : 15,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
