import { createHmac } from "node:crypto";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Who may pass the gate, as managed by the site owner in Studio:
//
//   - the master password on Site Settings (typed into the /enter form), and
//   - guest invite links, one "Guest access" document each (opened at
//     /invite/<token>, no typing).
//
// This module is the only place that reads either. Plain `fetch` (no Sanity
// client) so it stays cheap to bundle into src/proxy.ts, which runs on
// every page request.

const API_BASE = `https://${projectId}.api.sanity.io/v${apiVersion}/data`;

// Fresh reads straight from the API (not the CDN) so a just-published change
// is seen on the very next request.
async function query<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = new URL(`${API_BASE}/query/${dataset}`);
  url.searchParams.set("query", groq);
  url.searchParams.set("perspective", "published");
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(`$${name}`, JSON.stringify(value));
  }

  const token = process.env.SANITY_API_READ_TOKEN;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Sanity query failed: ${res.status} ${res.statusText}`);
  }
  return ((await res.json()) as { result: T }).result;
}

// Published, switched on, and not past its expiry (if it has one). Expiry is
// evaluated by Sanity at query time, so nothing has to run on a schedule.
const ACTIVE_GUEST_FILTER =
  `_type == "guestAccess" && active == true && defined(token)` +
  ` && (!defined(expiresAt) || expiresAt > now())`;

export interface GuestGrant {
  _id: string;
  token: string;
}

export async function fetchSitePassword(): Promise<string | null> {
  const result = await query<unknown>(`*[_id == "siteSettings"][0].sitePassword`);
  return typeof result === "string" && result.length > 0 ? result : null;
}

export async function findActiveGuest(token: string): Promise<GuestGrant | null> {
  const result = await query<GuestGrant | null>(
    `*[${ACTIVE_GUEST_FILTER} && token == $token][0]{ _id, token }`,
    { token }
  );
  return result ?? null;
}

export function requireGateSecret(): string {
  const secret = process.env.SITE_PASSWORD_SECRET;
  if (!secret) throw new Error("Missing SITE_PASSWORD_SECRET environment variable");
  return secret;
}

// --- Fingerprints ----------------------------------------------------------
//
// A fingerprint is a short, non-reversible tag for one way of getting in. It
// rides in the gate cookie so the cookie stops verifying the moment that
// way is withdrawn — the master password changed, or a guest entry switched
// off / expired / deleted — with no secret rotation. Keyed with the secret
// (not a bare hash) so a leaked cookie can't be brute-forced offline.

function fingerprint(input: string, secret: string): string {
  return createHmac("sha256", secret).update(input).digest("hex").slice(0, 16);
}

export function passwordFingerprint(password: string, secret: string): string {
  return fingerprint(password, secret);
}

export function guestFingerprint(guest: GuestGrant, secret: string): string {
  // Bound to the document as well as the token, so two entries can never
  // share a fingerprint even if a token were ever reused.
  return fingerprint(`guest:${guest._id}:${guest.token}`, secret);
}

async function fetchValidFingerprints(): Promise<Set<string>> {
  const secret = requireGateSecret();
  const { master, guests } = await query<{ master: unknown; guests: GuestGrant[] }>(
    `{
      "master": *[_id == "siteSettings"][0].sitePassword,
      "guests": *[${ACTIVE_GUEST_FILTER}]{ _id, token }
    }`
  );

  const valid = new Set<string>();
  if (typeof master === "string" && master.length > 0) {
    valid.add(passwordFingerprint(master, secret));
  }
  for (const guest of guests) {
    valid.add(guestFingerprint(guest, secret));
  }
  return valid;
}

// --- Per-instance cache, for the proxy -------------------------------------
//
// The proxy can't afford a Sanity round-trip per request, so it keeps the
// set of valid fingerprints in module memory for a short while. A cookie
// carrying a fingerprint that isn't in the cached set forces an early
// refresh (rate-limited), so a visitor who just came in through a brand-new
// password or invite isn't bounced back to the gate while the cache is stale.

const CACHE_TTL_MS = 30_000;
const MIN_REFRESH_INTERVAL_MS = 2_000;

let cached: { valid: Set<string>; fetchedAt: number } | null = null;
let inflight: Promise<Set<string>> | null = null;

function refreshValidFingerprints(): Promise<Set<string>> {
  if (!inflight) {
    inflight = fetchValidFingerprints()
      .catch((error) => {
        console.error(error);
        // Fail closed when there's nothing to fall back on; otherwise keep
        // serving the last known set rather than locking everyone out over
        // a transient Sanity error.
        return cached?.valid ?? new Set<string>();
      })
      .then((valid) => {
        cached = { valid, fetchedAt: Date.now() };
        inflight = null;
        return valid;
      });
  }
  return inflight;
}

export async function isCurrentFingerprint(candidate: string): Promise<boolean> {
  const age = cached ? Date.now() - cached.fetchedAt : Infinity;

  if (cached && age < CACHE_TTL_MS) {
    if (cached.valid.has(candidate)) return true;
    // Miss: either a withdrawn cookie or a stale cache. Re-check, but not
    // more often than every couple of seconds so a flood of dead cookies
    // can't turn into a flood of Sanity requests.
    if (age < MIN_REFRESH_INTERVAL_MS) return false;
  }

  const valid = await refreshValidFingerprints();
  return valid.has(candidate);
}

// --- Visit stamps ----------------------------------------------------------
//
// Lets the owner see in Studio whether (and when) a guest actually opened
// their link. Written to the published document and, if the owner has an
// unpublished edit open, to the draft too — otherwise their next publish
// would overwrite the stamps with the draft's older values.

export async function recordGuestVisit(guestId: string): Promise<void> {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    console.warn("SANITY_API_WRITE_TOKEN not set; skipping guest visit stamp");
    return;
  }

  const now = new Date().toISOString();
  const ids = await query<string[]>(`*[_id in $ids]._id`, {
    ids: [guestId, `drafts.${guestId}`],
  });

  const res = await fetch(`${API_BASE}/mutate/${dataset}?returnIds=false`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      mutations: ids.map((id) => ({
        patch: { id, setIfMissing: { firstViewedAt: now }, set: { lastViewedAt: now } },
      })),
    }),
  });
  if (!res.ok) {
    throw new Error(`Sanity visit stamp failed: ${res.status} ${res.statusText}`);
  }
}
