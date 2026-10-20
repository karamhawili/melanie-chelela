// Frontend rendering contract — every component in src/components/ and
// every page is built against these shapes. The adapter layer
// (adapters.ts) is the only place that translates raw Sanity query
// results into them.

export type TitleLineStyle = "regular" | "italic" | "gold" | "goldItalic";
export type TitleLineSize = "small" | "regular" | "large";

/** One line of a display title; `size` scales from the base size the surface sets. */
export interface TitleLine {
  text: string;
  style: TitleLineStyle;
  size: TitleLineSize;
}

export interface Project {
  slug: string;
  n: string;
  /** Plain name — for alt text, metadata and anywhere type isn't display-sized. */
  name: string;
  /** The name as set in display type: one entry per line. Never empty. */
  titleLines: TitleLine[];
  /** False when `titleLines` is only the plain name on one line, for want of a Display title. */
  hasDisplayTitle: boolean;
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
  /** Intrinsic width ÷ height of the asset — only projected where a block asks for it (plans). */
  aspectRatio?: number;
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
  heroImage: Plate;
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
  /** Legacy two-line title, kept for projects without a Display title. */
  titleLine1?: string;
  titleLine2?: string;
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

/**
 * A plate in a plans set. `kind` decides how `src` is drawn: an "image"
 * goes through next/image, a "pdf" is rasterised into a canvas in the
 * browser so it reads as a drawing rather than as a document.
 */
export interface Plan extends Plate {
  kind: "image" | "pdf";
}

export interface PlansBlock {
  _key: string;
  _type: "plansBlock";
  sectionNumber?: string;
  eyebrowLabel?: string;
  metaLabel?: string;
  /** 1–4 drawings; the count drives the layout. */
  plans: Plan[];
  /** Optional width ÷ height override shared by every frame. */
  aspectRatio?: string;
}

/** One swatch in a Materials collage: a photo, or a flat CSS colour/gradient. */
export interface MaterialItem {
  code: string;
  name: string;
  finish: string;
  tone?: string;
  image?: Plate;
}

export interface MaterialsBlock {
  _key: string;
  _type: "materialsBlock";
  /** 1–6 swatches; the collage has a slot for each. */
  items: MaterialItem[];
}

export interface FurniturePiece {
  index: string;
  name: string;
  designer: string;
  maker: string;
  image: Plate;
}

export interface FurnitureBlock {
  _key: string;
  _type: "furnitureBlock";
  /** 1–6 pieces; the collage has a slot for each. */
  pieces: FurniturePiece[];
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
  | PlansBlock
  | MaterialsBlock
  | FurnitureBlock
  | CreditsBlock;
