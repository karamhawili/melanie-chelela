// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

// Draft-mode / Visual Editing is out of scope for now, so there's no
// viewer-permission token to share with defineLive — published content only.
// (Published-read auth for the now-private dataset lives on the base
// `client` in ./client.ts, not here — serverToken only unlocks drafts.)
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: false,
  browserToken: false,
});
