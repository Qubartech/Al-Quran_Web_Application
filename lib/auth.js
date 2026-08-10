import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholderAnonKey";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

let schemaEnsured = false;

async function ensureDbSchema() {
  if (schemaEnsured) return;
  try {
    // 1. Ensure User table & columns exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT
      );
    `).catch(() => {});

    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email" TEXT;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "birthdate" TIMESTAMP;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferredReciter" TEXT DEFAULT 'mishari_al_afasy';`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferredTranslation" TEXT DEFAULT 'sahih_international';`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dailyGoal" INT DEFAULT 15;`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW();`).catch(() => {});
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW();`).catch(() => {});

    // 2. Ensure PrayerLog table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PrayerLog" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "fajr" BOOLEAN DEFAULT false,
        "dhuhr" BOOLEAN DEFAULT false,
        "asr" BOOLEAN DEFAULT false,
        "maghrib" BOOLEAN DEFAULT false,
        "isha" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `).catch(() => {});

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "PrayerLog" ADD CONSTRAINT "PrayerLog_userId_date_key" UNIQUE ("userId", "date");
    `).catch(() => {});

    // 3. Ensure LearnProgress table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LearnProgress" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "moduleId" TEXT NOT NULL,
        "completed" BOOLEAN DEFAULT true,
        "quizScore" INT,
        "maxScore" INT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `).catch(() => {});

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "LearnProgress" ADD CONSTRAINT "LearnProgress_userId_moduleId_key" UNIQUE ("userId", "moduleId");
    `).catch(() => {});

    schemaEnsured = true;
  } catch (e) {
    console.error("Database schema check error:", e);
  }
}

export async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    // Ensure database schema and User record exist
    await ensureDbSchema();

    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "User" ("id", "email", "updatedAt") VALUES ($1, $2, NOW()) ON CONFLICT ("id") DO UPDATE SET "email" = EXCLUDED."email", "updatedAt" = NOW()`,
        user.id,
        user.email || null
      );
    } catch (dbErr) {
      console.error("Error upserting user in local database:", dbErr);
    }

    return user.id;
  } catch (e) {
    console.error("Error in getUserIdFromRequest:", e);
    return null;
  }
}
