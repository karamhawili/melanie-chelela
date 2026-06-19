import { defineQuery } from "next-sanity";

// `cardImage` etc. are selected without a nested projection — a plain
// object field returns its raw value (asset ref + alt + hotspot/crop)
// as-is, which is exactly what resolveImageUrl()/urlFor() need.
const PROJECT_CARD_FIELDS = /* groq */ `
  title,
  "slug": slug.current,
  tag,
  location,
  area,
  year,
  order,
  cardImage,
  cardCaptionFig,
  cardCaptionLabel,
  description
`;

export const PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "project"] | order(order asc) {
    ${PROJECT_CARD_FIELDS}
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "project"]{ "slug": slug.current }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    ${PROJECT_CARD_FIELDS},
    seoTitle,
    seoDescription,
    pageBuilder[]{ ... }
  }
`);

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0]{ ... }
`);

export const WORKS_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "worksPage"][0]{ ... }
`);

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{ ... }
`);
