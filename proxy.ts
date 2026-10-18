import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

// Routes that are always accessible without a session
const PUBLIC_ROUTES = ["/login", "/register"];

// Routes that are explicitly for guests; authenticated users are redirected away
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistically decrypt the session from the cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(sessionCookie);

  const isPublicRoute = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY_ROUTES.some((p) => pathname.startsWith(p));

  // If not authenticated and trying to access a protected route → redirect to login
  if (!isPublicRoute && !session?.userId) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and visiting a guest-only page (login/register) → redirect to home
  if (isGuestOnly && session?.userId) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /api/* (API routes handle their own auth)
     * - /_next/static, /_next/image (static assets)
     * - /favicon.ico, /public/* (public files)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|svg|ico)$).*)",
  ],
};
