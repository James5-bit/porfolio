import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getPasswordHash } from "./passwordStore";

const COOKIE_NAME = "admin_session";
const SESSION_HOURS = 12;

function getSecretKey(): Uint8Array {
  // Falls back to a derived secret so local dev works out of the box;
  // set JWT_SECRET in .env.local for anything beyond local/self-hosted use.
  const secret = process.env.JWT_SECRET || "dev-only-insecure-secret-set-JWT_SECRET-in-env";
  return new TextEncoder().encode(secret);
}

export async function verifyPassword(plain: string): Promise<boolean> {
  const hash = await getPasswordHash();
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_HOURS * 60 * 60,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionFromCookies(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
