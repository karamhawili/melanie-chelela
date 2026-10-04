import { createHmac } from "node:crypto";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// The gate password lives in the Site Settings document so the site owner
// can rotate it from Studio without a redeploy. This module is the only
// place that reads it: a plain `fetch` (no Sanity client) so it stays cheap
// to bundle into src/proxy.ts, which runs on every page request.

const QUERY = `*[_id == "siteSettings"][0].sitePassword`;

// Fresh read, straight from the API (not the CDN) so a just-published
// password is accepted on the very next login attempt.
export async function fetchSitePassword(): Promise<string | null> {
  const url =
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}&perspective=published`;

  const token = process.env.SANITY_API_READ_TOKEN;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Sanity password lookup failed: ${res.status} ${res.statusText}`);
  }

  const { result } = (await res.json()) as { result?: unknown };
  return typeof result === "string" && result.length > 0 ? result : null;
}

// Short, non-reversible tag for a password. It rides in the gate cookie so
// that cookies issued under an old password stop verifying the moment the
// password changes — no secret rotation needed. Keyed with the secret (not
// a bare hash) so a leaked cookie can't be brute-forced offline to recover
// the password.
export function passwordFingerprint(password: string, secret: string): string {
  return createHmac("sha256", secret).update(password).digest("hex").slice(0, 16);
}

export function requireGateSecret(): string {
  const secret = process.env.SITE_PASSWORD_SECRET;
  if (!secret) throw new Error("Missing SITE_PASSWORD_SECRET environment variable");
  return secret;
}

// --- Per-instance cache of the current fingerprint, for the proxy ---------
//
// The proxy can't afford a Sanity round-trip per request, so it keeps the
// fingerprint in module memory for a short while. A cookie carrying a
// fingerprint that doesn't match the cached one forces an early refresh
// (rate-limited), so a visitor who just logged in with a brand-new password
// isn't bounced back to the gate while the cache is stale.

const CACHE_TTL_MS = 30_000;
const MIN_REFRESH_INTERVAL_MS = 2_000;

let cached: { fingerprint: string | null; fetchedAt: number } | null = null;
let inflight: Promise<string | null> | null = null;

async function refreshFingerprint(): Promise<string | null> {
  if (!inflight) {
    inflight = fetchSitePassword()
      .then((password) => (password ? passwordFingerprint(password, requireGateSecret()) : null))
      .catch((error) => {
        console.error(error);
        // Fail closed when there's nothing to fall back on; otherwise keep
        // serving the last known value rather than locking everyone out
        // over a transient Sanity error.
        return cached?.fingerprint ?? null;
      })
      .then((fingerprint) => {
        cached = { fingerprint, fetchedAt: Date.now() };
        inflight = null;
        return fingerprint;
      });
  }
  return inflight;
}

export async function isCurrentPasswordFingerprint(fingerprint: string): Promise<boolean> {
  const age = cached ? Date.now() - cached.fetchedAt : Infinity;

  if (cached && age < CACHE_TTL_MS) {
    if (cached.fingerprint === fingerprint) return true;
    // Mismatch: either a stale cookie or a stale cache. Re-check, but not
    // more often than every couple of seconds so a flood of old cookies
    // can't turn into a flood of Sanity requests.
    if (age < MIN_REFRESH_INTERVAL_MS) return false;
  }

  const current = await refreshFingerprint();
  return current !== null && current === fingerprint;
}
