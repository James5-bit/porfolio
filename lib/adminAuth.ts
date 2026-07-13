import { NextResponse } from "next/server";
import { getSessionFromCookies } from "./auth";

// Defense-in-depth check used inside each mutation API route, on top of
// the middleware guard. Reads the httpOnly JWT session cookie.
export async function requireAuth(): Promise<NextResponse | null> {
  const valid = await getSessionFromCookies();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
  }
  return null;
}
