import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "dev-only-insecure-secret-set-JWT_SECRET-in-env";
  return new TextEncoder().encode(secret);
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const authed = await isValidSession(token);

  // Protect admin pages (except the login page itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect mutation API calls at the edge too (routes also re-check via requireAuth)
  const isMutation = ["POST", "PUT", "DELETE"].includes(req.method);
  const isProtectedApi =
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/skills") ||
    pathname.startsWith("/api/experience") ||
    pathname.startsWith("/api/certificates") ||
    pathname.startsWith("/api/content") ||
    pathname.startsWith("/api/upload");

  if (isMutation && isProtectedApi && !authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/skills/:path*", "/api/experience/:path*", "/api/certificates/:path*", "/api/content", "/api/upload"],
};
