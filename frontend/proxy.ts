import { NextRequest, NextResponse } from "next/server";

// Matches Laravel's default session cookie name: Str::slug(env('APP_NAME')) . '-session'.
const SESSION_COOKIE_NAME =
  process.env.SANCTUM_SESSION_COOKIE ?? "ecommerce-session";

/**
 * UX redirect only, not a security boundary: the Edge runtime can't decrypt/validate
 * Laravel's session cookie, so this only checks presence to bounce obviously-logged-out
 * visitors away from /admin. Real enforcement stays with the Laravel API (401/403) and
 * the client-side ability layer built from /api/v1/me.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
