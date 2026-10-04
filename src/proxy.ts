import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE_NAME, parseGateCookie } from "@/lib/siteGate";
import { isCurrentPasswordFingerprint } from "@/lib/sitePassword";

const GATE_PATH = "/enter";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Always reachable pre-auth — both for the redirect target itself and so
  // its password-submit Server Action (a POST to this same route) isn't
  // silently skipped by the matcher below.
  if (pathname === GATE_PATH) {
    return NextResponse.next();
  }

  const cookie = parseGateCookie(
    request.cookies.get(GATE_COOKIE_NAME)?.value,
    process.env.SITE_PASSWORD_SECRET
  );
  if (cookie && (await isCurrentPasswordFingerprint(cookie.passwordFingerprint))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = GATE_PATH;
  url.search = "";
  const redirectTo = pathname + search;
  if (redirectTo !== "/") {
    url.searchParams.set("redirect", redirectTo);
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Excludes: build assets, the image optimizer, favicon, robots.txt (a
    // crawler must reach it without hitting the gate redirect), the Sanity
    // revalidate webhook (server-to-server, has its own signature check),
    // and /studio (already gated by its own Sanity login).
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|api/revalidate|studio).*)",
  ],
};
