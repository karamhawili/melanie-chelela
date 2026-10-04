// Guest invite links look like https://<site>/invite/k7mq2xvp — a short,
// flat, lowercase code on the real domain, the shape of links people
// already trust (YouTube, Luma, WeTransfer). No query string, no mixed case.
//
// Isomorphic on purpose: Studio generates tokens in the browser when an
// entry is created; the server only ever validates the shape.

// No look-alike characters (i/l/1, o/0) so a link read aloud or retyped
// from a screenshot still works. 31^8 ≈ 8.5e11 combinations, and the only
// way to test a guess is one request to the site.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const LENGTH = 8;

export const INVITE_TOKEN_PATTERN = new RegExp(`^[${ALPHABET}]{${LENGTH}}$`);

export function generateInviteToken(): string {
  // Rejection sampling keeps every character equally likely (256 isn't a
  // multiple of 31). Draw a few spare bytes to make reruns rare.
  const limit = 256 - (256 % ALPHABET.length);
  let out = "";
  while (out.length < LENGTH) {
    const bytes = new Uint8Array(LENGTH * 2);
    globalThis.crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte < limit && out.length < LENGTH) out += ALPHABET[byte % ALPHABET.length];
    }
  }
  return out;
}

export function invitePath(token: string): string {
  return `/invite/${token}`;
}
