import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const provided = req.headers.get("x-admin-password");

  if (!password) {
    return NextResponse.json(
      { ok: false, error: "Server is missing ADMIN_PASSWORD. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }
  if (!provided || provided !== password) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
