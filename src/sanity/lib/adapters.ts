import type { SanityImageSource } from "@sanity/image-url";
import { resolveImageUrl } from "./image";
import type {
  CaseStudyBlock,
  Fact,
  HomePageContent,
  Plate,
  Project,
  ServiceItem,
  SiteSettings,
  WorksPageContent,
} from "./types";

// --- Raw shapes as they come back from GROQ (loose/optional — Studio
// validation guarantees required-ness on published content, but the
// adapter shouldn't crash on a still-empty draft field). ---

interface RawImage {
  asset?: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
}

interface RawPlate {
  image?: RawImage;
  fig?: string;
  label?: string;
}

interface RawFact {
  label?: string;
  value?: string;
  accent?: boolean;
}

interface RawServiceItem {
  letter?: string;
  title?: string;
  description?: string;
}

export interface RawProject {
  title?: string;
  slug?: string;
  tag?: string;
  location?: string;
  area?: string;
  year?: string;
  order?: number;
  cardImage?: RawImage;
  cardCaptionFig?: string;
  cardCaptionLabel?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  pageBuilder?: Array<Record<string, unknown>>;
}

export interface RawHomePage {
  heroEyebrow?: string;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroMetaLeft?: string;
  heroMetaRight?: string;
  heroImage?: RawImage;
  wallDividerText?: string;
  philosophyHeading?: string;
  philosophyHeadingEmphasis?: string;
  philosophyParagraph1?: string;
  philosophyParagraph2?: string;
  selectedWorkCount?: number;
  services?: RawServiceItem[];
  inquireHeading?: string;
  inquireHeadingEmphasis?: string;
}

export interface RawWorksPage {
  mastheadEyebrow?: string;
  mastheadTitleLine1?: string;
  mastheadTitleLine2?: string;
  mastheadIntro?: string;
  closingEyebrow?: string;
  closingHeading?: string;
  closingHeadingEmphasis?: string;
}

export interface RawSiteSettings {
  wordmark?: string;
  footerCopyright?: string;
  footerCoordinates?: string;
  inquireEmail?: string;
  inquireAddress?: string;
  projectCounterTotal?: number;
}

// --- Leaf adapters ---

function toImageUrl(image: RawImage | undefined): string {
  return resolveImageUrl(image as SanityImageSource | undefined);
}

export function toPlate(raw: RawPlate | undefined): Plate {
  return {
    src: toImageUrl(raw?.image),
    alt: raw?.image?.alt ?? "",
    fig: raw?.fig ?? "",
    label: raw?.label ?? "",
  };
}

export function toFact(raw: RawFact | undefined): Fact {
  return {
    label: raw?.label ?? "",
    value: raw?.value ?? "",
    accent: raw?.accent,
  };
}

function toFacts(raw: RawFact[] | undefined): Fact[] {
  return (raw ?? []).map(toFact);
}

function toServiceItem(raw: RawServiceItem): ServiceItem {
  return {
    letter: raw.letter ?? "",
    title: raw.title ?? "",
    description: raw.description ?? "",
  };
}

// --- Project (card / summary shape) ---

export function toProject(raw: RawProject): Project {
  const order = raw.order ?? 0;
  return {
    slug: raw.slug ?? "",
    n: String(order).padStart(2, "0"),
    name: raw.title ?? "",
    tag: raw.tag ?? "",
    location: raw.location ?? "",
    area: raw.area ?? "",
    year: raw.year ?? "",
    image: toImageUrl(raw.cardImage),
    caption: [raw.cardCaptionFig, raw.cardCaptionLabel].filter(Boolean).join(" — "),
    description: raw.description ?? "",
  };
}

// --- Case study page-builder blocks ---

export function toCaseStudyBlocks(raw: RawProject["pageBuilder"]): CaseStudyBlock[] {
  return (raw ?? []).map((block) => toCaseStudyBlock(block)).filter((b): b is CaseStudyBlock => b !== null);
}

function toCaseStudyBlock(block: Record<string, unknown>): CaseStudyBlock | null {
  const key = String(block._key ?? "");
  switch (block._type) {
    case "caseStudyHero":
      return {
        _key: key,
        _type: "caseStudyHero",
        eyebrow: String(block.eyebrow ?? ""),
        titleLine1: String(block.titleLine1 ?? ""),
        titleLine2: String(block.titleLine2 ?? ""),
        intro: String(block.intro ?? ""),
        facts: toFacts(block.facts as RawFact[] | undefined),
      };
    case "fullBleedImage":
      return {
        _key: key,
        _type: "fullBleedImage",
        plate: toPlate(block.plate as RawPlate | undefined),
        height: block.height ? String(block.height) : undefined,
      };
    case "overviewBlock":
      return {
        _key: key,
        _type: "overviewBlock",
        sectionNumber: String(block.sectionNumber ?? ""),
        eyebrowLabel: String(block.eyebrowLabel ?? ""),
        facts: toFacts(block.facts as RawFact[] | undefined),
        statement: String(block.statement ?? ""),
        statementEmphasis: String(block.statementEmphasis ?? ""),
        body: String(block.body ?? ""),
      };
    case "beforeAfterBlock":
      return {
        _key: key,
        _type: "beforeAfterBlock",
        sectionNumber: String(block.sectionNumber ?? ""),
        eyebrowLabel: String(block.eyebrowLabel ?? ""),
        dragLabel: String(block.dragLabel ?? ""),
        before: toPlate(block.before as RawPlate | undefined),
        after: toPlate(block.after as RawPlate | undefined),
        caption: block.caption ? String(block.caption) : undefined,
      };
    case "twoUpImageBlock":
      return {
        _key: key,
        _type: "twoUpImageBlock",
        sectionNumber: block.sectionNumber ? String(block.sectionNumber) : undefined,
        eyebrowLabel: block.eyebrowLabel ? String(block.eyebrowLabel) : undefined,
        metaLabel: block.metaLabel ? String(block.metaLabel) : undefined,
        left: toPlate(block.left as RawPlate | undefined),
        right: toPlate(block.right as RawPlate | undefined),
        leftAspectRatio: block.leftAspectRatio ? String(block.leftAspectRatio) : undefined,
        rightAspectRatio: block.rightAspectRatio ? String(block.rightAspectRatio) : undefined,
      };
    case "quotePortraitBlock":
      return {
        _key: key,
        _type: "quotePortraitBlock",
        quote: String(block.quote ?? ""),
        quoteEmphasis: String(block.quoteEmphasis ?? ""),
        portrait: toPlate(block.portrait as RawPlate | undefined),
      };
    case "textImageBlock":
      return {
        _key: key,
        _type: "textImageBlock",
        sectionNumber: String(block.sectionNumber ?? ""),
        eyebrowLabel: String(block.eyebrowLabel ?? ""),
        heading: String(block.heading ?? ""),
        plate: toPlate(block.plate as RawPlate | undefined),
      };
    case "creditsBlock":
      return {
        _key: key,
        _type: "creditsBlock",
        sectionNumber: String(block.sectionNumber ?? ""),
        eyebrowLabel: String(block.eyebrowLabel ?? ""),
        credits: toFacts(block.credits as RawFact[] | undefined),
      };
    default:
      return null;
  }
}

// --- Singletons ---

export function toHomePage(raw: RawHomePage): HomePageContent {
  return {
    heroEyebrow: raw.heroEyebrow ?? "",
    heroTitleLine1: raw.heroTitleLine1 ?? "",
    heroTitleLine2: raw.heroTitleLine2 ?? "",
    heroMetaLeft: raw.heroMetaLeft ?? "",
    heroMetaRight: raw.heroMetaRight ?? "",
    heroImage: { src: toImageUrl(raw.heroImage), alt: raw.heroImage?.alt ?? "", fig: "", label: "" },
    wallDividerText: raw.wallDividerText ?? "",
    philosophyHeading: raw.philosophyHeading ?? "",
    philosophyHeadingEmphasis: raw.philosophyHeadingEmphasis ?? "",
    philosophyParagraph1: raw.philosophyParagraph1 ?? "",
    philosophyParagraph2: raw.philosophyParagraph2 ?? "",
    selectedWorkCount: raw.selectedWorkCount ?? 4,
    services: (raw.services ?? []).map(toServiceItem),
    inquireHeading: raw.inquireHeading ?? "",
    inquireHeadingEmphasis: raw.inquireHeadingEmphasis ?? "",
  };
}

export function toWorksPage(raw: RawWorksPage): WorksPageContent {
  return {
    mastheadEyebrow: raw.mastheadEyebrow ?? "",
    mastheadTitleLine1: raw.mastheadTitleLine1 ?? "",
    mastheadTitleLine2: raw.mastheadTitleLine2 ?? "",
    mastheadIntro: raw.mastheadIntro ?? "",
    closingEyebrow: raw.closingEyebrow ?? "",
    closingHeading: raw.closingHeading ?? "",
    closingHeadingEmphasis: raw.closingHeadingEmphasis ?? "",
  };
}

export function toSiteSettings(raw: RawSiteSettings): SiteSettings {
  return {
    wordmark: raw.wordmark ?? "",
    footerCopyright: raw.footerCopyright ?? "",
    footerCoordinates: raw.footerCoordinates ?? "",
    inquireEmail: raw.inquireEmail ?? "",
    inquireAddress: raw.inquireAddress ?? "",
    projectCounterTotal: raw.projectCounterTotal ?? 0,
  };
}
