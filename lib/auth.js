import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholderAnonKey";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserIdFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;

    // Ensure the user exists in our local database
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: {
        id: user.id,
        email: user.email,
      },
    });

    return user.id;
  } catch (e) {
    console.error("Error in getUserIdFromRequest:", e);
    return null;
  }
}
