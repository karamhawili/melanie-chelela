import { createHmac, timingSafeEqual } from "node:crypto";

// Shared between src/proxy.ts (verifies the cookie on every request) and
// src/app/enter/actions.ts (issues the cookie on a correct password) so the
// cookie name, expiry, and signing logic can't drift out of sync.

export const GATE_COOKIE_NAME = "mc_gate";
export const GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sign(issuedAtSeconds: string, secret: string): string {
  return createHmac("sha256", secret).update(issuedAtSeconds).digest("hex");
}

// Cookie value is "<issuedAtSeconds>.<hmacHex>" — never the password itself,
// so a leaked/forged cookie doesn't expose it.
export function createGateCookieValue(secret: string): string {
  const issuedAtSeconds = Math.floor(Date.now() / 1000).toString();
  return `${issuedAtSeconds}.${sign(issuedAtSeconds, secret)}`;
}

export function isValidGateCookie(value: string | undefined, secret: string | undefined): boolean {
  if (!value || !secret) return false;

  const [issuedAt, providedHmac] = value.split(".");
  if (!issuedAt || !providedHmac) return false;

  const issuedAtSeconds = Number(issuedAt);
  if (!Number.isFinite(issuedAtSeconds)) return false;
  if (Date.now() / 1000 - issuedAtSeconds > GATE_MAX_AGE_SECONDS) return false;

  const expected = Buffer.from(sign(issuedAt, secret), "hex");
  const provided = Buffer.from(providedHmac, "hex");
  if (provided.length !== expected.length) return false;

  return timingSafeEqual(provided, expected);
}
