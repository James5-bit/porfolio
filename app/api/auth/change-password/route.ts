import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { setPassword } from "@/lib/passwordStore";
import { requireAuth } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both fields are required." }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
  }

  const ok = await verifyPassword(currentPassword);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await setPassword(newPassword);
  return NextResponse.json({ ok: true });
}
