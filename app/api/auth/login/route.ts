import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const { allowed, retryAfterSeconds } = checkRateLimit(`login:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const ok = await verifyPassword(password);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  resetRateLimit(`login:${ip}`);
  const token = await signSession();
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
