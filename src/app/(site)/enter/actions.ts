"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createGateCookieValue, gateCookieOptions } from "@/lib/siteGate";
import { fetchSitePassword, passwordFingerprint, requireGateSecret } from "@/lib/siteAccess";

function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

// Only allow redirecting back to a same-origin relative path — rejects
// anything that looks like an absolute/external URL (open-redirect guard).
function safeRedirectTarget(raw: FormDataEntryValue | null): string {
  const value = typeof raw === "string" ? raw : "";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function unlockSite(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirectTarget(formData.get("redirect"));

  // Owner-managed in Studio (Site Settings → Site password); no password set
  // means the gate stays closed rather than open.
  const expected = await fetchSitePassword();
  if (!expected || !timingSafeStringEqual(password, expected)) {
    redirect(`/enter?error=1&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const secret = requireGateSecret();

  (await cookies()).set({
    ...gateCookieOptions(),
    value: createGateCookieValue(secret, passwordFingerprint(expected, secret)),
  });

  redirect(redirectTo);
}
