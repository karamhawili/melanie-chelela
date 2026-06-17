export interface Fact {
  label: string;
  value: string;
  accent?: boolean;
}

export interface Plate {
  src: string;
  alt: string;
  fig: string;
  label: string;
}

export interface CaseStudyContent {
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroIntro: string;
  heroFacts: Fact[];
  lead: Plate;
  overviewFacts: Fact[];
  overviewStatement: string;
  overviewStatementItalic: string;
  overviewBody: string;
  threshold: {
    before: Plate;
    after: Plate;
    caption: string;
  };
  dining: Plate;
  bar: [Plate, Plate];
  details: [Plate, Plate];
  quote: string;
  quoteItalic: string;
  portrait: Plate;
  corridor: Plate;
  passage: {
    heading: string;
    plate: Plate;
  };
  arrival: {
    day: Plate;
    dusk: Plate;
  };
  credits: Fact[];
}

const TERRA_MARE_DIR = "/projects/terra-mare";

export const caseStudies: Partial<Record<string, CaseStudyContent>> = {
  "terra-mare": {
    heroEyebrow: "Rooftop Restaurant & Bar",
    heroTitleLine1: "Son of",
    heroTitleLine2: "a Fish",
    heroIntro:
      "A rooftop carved from stone, reed and sea-light — where the Mediterranean is set at the table.",
    heroFacts: [
      { label: "Location", value: "Beirut, Lebanon" },
      { label: "Typology", value: "Restaurant & Bar" },
      { label: "Area", value: "740 m²" },
      { label: "Year", value: "2024", accent: true },
    ],
    lead: {
      src: `${TERRA_MARE_DIR}/cam07.jpg`,
      alt: "The Terrace",
      fig: "Fig. 01",
      label: "The Terrace — West Sea View",
    },
    overviewFacts: [
      { label: "Scope", value: "Interior Architecture" },
      { label: "Detail", value: "Bespoke Joinery" },
      { label: "Palette", value: "Stone · Reed · Terracotta" },
      { label: "Status", value: "Completed", accent: true },
    ],
    overviewStatement:
      "Seven hundred metres above the corniche, a room that withholds — so the sea can do the talking.",
    overviewStatementItalic: "withholds",
    overviewBody:
      "Hand-laid stone, woven reed ceilings, terracotta and crazy-paved travertine are held in a single warm key. Light is kept low and deliberate; every threshold, niche and run of joinery is drawn to frame a view, a material, or a pause.",
    threshold: {
      before: {
        src: `${TERRA_MARE_DIR}/cam08.jpg`,
        alt: "Threshold closed",
        fig: "",
        label: "Closed",
      },
      after: {
        src: `${TERRA_MARE_DIR}/cam09.jpg`,
        alt: "Threshold open",
        fig: "",
        label: "Open",
      },
      caption: "Fig. 02 / 03",
    },
    dining: {
      src: `${TERRA_MARE_DIR}/cam03.jpg`,
      alt: "The Dining Room",
      fig: "Fig. 04",
      label: "The Dining Room",
    },
    bar: [
      { src: `${TERRA_MARE_DIR}/cam05.jpg`, alt: "The Round Bar", fig: "Fig. 05", label: "Round Bar" },
      { src: `${TERRA_MARE_DIR}/cam06.jpg`, alt: "The Long Bar", fig: "Fig. 06", label: "Long Bar" },
    ],
    details: [
      { src: `${TERRA_MARE_DIR}/cam12.png`, alt: "Ablutions", fig: "Fig. 07", label: "Ablutions" },
      { src: `${TERRA_MARE_DIR}/cam04.png`, alt: "Candle Alcove", fig: "Fig. 08", label: "Candle Alcove" },
    ],
    quote: "Luxury is what remains when nothing is excessive.",
    quoteItalic: "when nothing",
    portrait: {
      src: `${TERRA_MARE_DIR}/cam13.png`,
      alt: "Powder Room",
      fig: "Fig. 09",
      label: "Powder Room",
    },
    corridor: {
      src: `${TERRA_MARE_DIR}/cam11.png`,
      alt: "The Corridor",
      fig: "Fig. 10",
      label: "The Corridor",
    },
    passage: {
      heading: "Curved plaster and a single reed niche turn a corridor into a held breath.",
      plate: {
        src: `${TERRA_MARE_DIR}/cam10.png`,
        alt: "The Passage",
        fig: "Fig. 11",
        label: "The Passage",
      },
    },
    arrival: {
      day: { src: `${TERRA_MARE_DIR}/cam01.jpg`, alt: "Arrival by day", fig: "Fig. 12", label: "Day" },
      dusk: { src: `${TERRA_MARE_DIR}/cam02.jpg`, alt: "Arrival at dusk", fig: "Fig. 13", label: "Dusk" },
    },
    credits: [
      { label: "Design", value: "Studio Melanie Chlela" },
      { label: "Visualisation", value: "In-house Render" },
      { label: "Location", value: "Beirut, Lebanon" },
      { label: "Year", value: "2024", accent: true },
    ],
  },
};
