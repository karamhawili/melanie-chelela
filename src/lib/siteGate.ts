import { createHmac, timingSafeEqual } from "node:crypto";

// Shared between src/proxy.ts (verifies the cookie on every request) and
// src/app/(site)/enter/actions.ts (issues the cookie on a correct password) so the
// cookie name, expiry, and signing logic can't drift out of sync.

export const GATE_COOKIE_NAME = "mc_gate";
export const GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Same attributes whether the cookie is issued by the /enter form or an
// /invite link, so the two can never drift apart.
export function gateCookieOptions() {
  return {
    name: GATE_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: GATE_MAX_AGE_SECONDS,
    path: "/",
  };
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

// Cookie value is "<issuedAtSeconds>.<passwordFingerprint>.<hmacHex>" — never
// the password itself, so a leaked/forged cookie doesn't expose it. The
// fingerprint ties the cookie to the password it was issued under: when the
// owner changes the password in Studio, every existing cookie stops matching
// (see src/lib/sitePassword.ts) without anyone rotating SITE_PASSWORD_SECRET.
export function createGateCookieValue(secret: string, passwordFingerprint: string): string {
  const issuedAtSeconds = Math.floor(Date.now() / 1000).toString();
  const payload = `${issuedAtSeconds}.${passwordFingerprint}`;
  return `${payload}.${sign(payload, secret)}`;
}

export interface GateCookie {
  passwordFingerprint: string;
}

// Checks signature and age only. Whether the fingerprint still matches the
// current password is the caller's job (it needs a Sanity lookup).
export function parseGateCookie(
  value: string | undefined,
  secret: string | undefined
): GateCookie | null {
  if (!value || !secret) return null;

  const [issuedAt, passwordFingerprint, providedHmac] = value.split(".");
  if (!issuedAt || !passwordFingerprint || !providedHmac) return null;

  const issuedAtSeconds = Number(issuedAt);
  if (!Number.isFinite(issuedAtSeconds)) return null;
  if (Date.now() / 1000 - issuedAtSeconds > GATE_MAX_AGE_SECONDS) return null;

  const expected = Buffer.from(sign(`${issuedAt}.${passwordFingerprint}`, secret), "hex");
  const provided = Buffer.from(providedHmac, "hex");
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  return { passwordFingerprint };
}
