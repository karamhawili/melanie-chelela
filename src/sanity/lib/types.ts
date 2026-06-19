// Frontend rendering contract — every component in src/components/ and
// every page is built against these shapes. The adapter layer
// (adapters.ts) is the only place that translates raw Sanity query
// results into them.

export interface Project {
  slug: string;
  n: string;
  name: string;
  tag: string;
  location: string;
  area: string;
  year: string;
  image: string;
  caption: string;
  description: string;
}

export interface Plate {
  src: string;
  alt: string;
  fig: string;
  label: string;
}

export interface Fact {
  label: string;
  value: string;
  accent?: boolean;
}

export interface ServiceItem {
  letter: string;
  title: string;
  description: string;
}

export interface HomePageContent {
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroMetaLeft: string;
  heroMetaRight: string;
  heroImage: Plate;
  wallDividerText: string;
  philosophyHeading: string;
  philosophyHeadingEmphasis: string;
  philosophyParagraph1: string;
  philosophyParagraph2: string;
  selectedWorkCount: number;
  services: ServiceItem[];
  inquireHeading: string;
  inquireHeadingEmphasis: string;
}

export interface WorksPageContent {
  mastheadEyebrow: string;
  mastheadTitleLine1: string;
  mastheadTitleLine2: string;
  mastheadIntro: string;
  closingEyebrow: string;
  closingHeading: string;
  closingHeadingEmphasis: string;
}

export interface SiteSettings {
  wordmark: string;
  footerCopyright: string;
  footerCoordinates: string;
  inquireEmail: string;
  inquireAddress: string;
  projectCounterTotal: number;
}

// --- Case study page-builder blocks ---

export interface CaseStudyHeroBlock {
  _key: string;
  _type: "caseStudyHero";
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
  facts: Fact[];
}

export interface FullBleedImageBlock {
  _key: string;
  _type: "fullBleedImage";
  plate: Plate;
  height?: string;
}

export interface OverviewBlock {
  _key: string;
  _type: "overviewBlock";
  sectionNumber: string;
  eyebrowLabel: string;
  facts: Fact[];
  statement: string;
  statementEmphasis: string;
  body: string;
}

export interface BeforeAfterBlock {
  _key: string;
  _type: "beforeAfterBlock";
  sectionNumber: string;
  eyebrowLabel: string;
  dragLabel: string;
  before: Plate;
  after: Plate;
  caption?: string;
}

export interface TwoUpImageBlock {
  _key: string;
  _type: "twoUpImageBlock";
  sectionNumber?: string;
  eyebrowLabel?: string;
  metaLabel?: string;
  left: Plate;
  right: Plate;
  leftAspectRatio?: string;
  rightAspectRatio?: string;
}

export interface QuotePortraitBlock {
  _key: string;
  _type: "quotePortraitBlock";
  quote: string;
  quoteEmphasis: string;
  portrait: Plate;
}

export interface TextImageBlock {
  _key: string;
  _type: "textImageBlock";
  sectionNumber: string;
  eyebrowLabel: string;
  heading: string;
  plate: Plate;
}

export interface CreditsBlock {
  _key: string;
  _type: "creditsBlock";
  sectionNumber: string;
  eyebrowLabel: string;
  credits: Fact[];
}

export type CaseStudyBlock =
  | CaseStudyHeroBlock
  | FullBleedImageBlock
  | OverviewBlock
  | BeforeAfterBlock
  | TwoUpImageBlock
  | QuotePortraitBlock
  | TextImageBlock
  | CreditsBlock;
