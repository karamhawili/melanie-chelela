import { NextResponse, after } from "next/server";
import type { NextRequest } from "next/server";
import { createGateCookieValue, gateCookieOptions } from "@/lib/siteGate";
import { INVITE_TOKEN_PATTERN } from "@/lib/inviteToken";
import {
  findActiveGuest,
  guestFingerprint,
  recordGuestVisit,
  requireGateSecret,
} from "@/lib/siteAccess";

// Guest invite link: https://<site>/invite/<token>. Opening it is the
// guest's whole login — it issues the same gate cookie the /enter form
// would, then lands them on the home page. A link whose entry has been
// switched off, deleted, or has expired bounces to the gate with a note.
// src/proxy.ts lets this path through unauthenticated.

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { token } = await params;
  const home = new URL("/", request.url);
  const gate = new URL("/enter?error=invite", request.url);

  // Cheap shape check first so junk never reaches Sanity.
  if (!INVITE_TOKEN_PATTERN.test(token)) {
    return NextResponse.redirect(gate);
  }

  const guest = await findActiveGuest(token);
  if (!guest) {
    return NextResponse.redirect(gate);
  }

  const secret = requireGateSecret();
  const response = NextResponse.redirect(home);
  response.cookies.set({
    ...gateCookieOptions(),
    value: createGateCookieValue(secret, guestFingerprint(guest, secret)),
  });

  // Stamp first/last opened after the redirect has been sent, so a slow or
  // failing write never delays or breaks the guest's entry.
  after(() => recordGuestVisit(guest._id).catch(console.error));

  return response;
}
