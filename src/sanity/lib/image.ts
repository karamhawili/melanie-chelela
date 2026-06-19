import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// Resolves a Sanity image value to a plain CDN URL string — the one place
// this happens, so every component keeps its existing `src: string` prop
// instead of threading {asset, hotspot, crop} through the whole tree.
export function resolveImageUrl(source: SanityImageSource | undefined | null): string {
  if (!source) return ''
  return urlFor(source).width(2400).auto('format').url()
}
