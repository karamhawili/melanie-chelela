/**
 * One-time seed script — migrates the hardcoded content in
 * src/lib/projects.ts and src/lib/caseStudies.ts (plus the Home/Works/
 * Header/Footer copy) into Sanity.
 *
 * Idempotent: documents use deterministic IDs and are written via
 * createOrReplace, so it's safe to re-run. Image assets are NOT
 * de-duplicated across re-runs (each run re-uploads and creates new asset
 * documents) — acceptable for a one-off migration script.
 *
 * Usage: npx tsx --env-file=.env.local scripts/seed-sanity.ts
 */

import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");
const token = requireEnv("SANITY_API_WRITE_TOKEN");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-02-01",
  useCdn: false,
});

const ASSETS_DIR = path.join(process.cwd(), "public/projects/terra-mare");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function key(): string {
  return randomUUID().slice(0, 12);
}

function fact(label: string, value: string, accent = false) {
  return { _key: key(), _type: "fact" as const, label, value, accent };
}

// --- Step 1: upload every local image, building filename -> asset _id ---

async function uploadAssets(): Promise<Map<string, string>> {
  const files = await readdir(ASSETS_DIR);
  const map = new Map<string, string>();

  for (const filename of files) {
    const filePath = path.join(ASSETS_DIR, filename);
    const asset = await client.assets.upload("image", createReadStream(filePath), {
      filename,
    });
    map.set(filename, asset._id);
    console.log(`  uploaded ${filename} -> ${asset._id}`);
  }

  return map;
}

function makeImageField(assetMap: Map<string, string>) {
  return (filename: string, alt: string) => {
    const assetId = assetMap.get(filename);
    if (!assetId) throw new Error(`No uploaded asset found for ${filename}`);
    return {
      _type: "image" as const,
      asset: { _type: "reference" as const, _ref: assetId },
      alt,
    };
  };
}

// --- Step 2: the 6 project summary documents ---

interface ProjectSeed {
  slug: string;
  order: number;
  title: string;
  tag: string;
  location: string;
  area: string;
  year: string;
  imageFile: string;
  cardCaptionFig: string;
  cardCaptionLabel: string;
  description: string;
}

const PROJECTS: ProjectSeed[] = [
  {
    slug: "terra-mare",
    order: 1,
    title: "Son of a Fish",
    tag: "Restaurant & Bar",
    location: "Beirut",
    area: "740 m²",
    year: "2024",
    imageFile: "cam07.jpg",
    cardCaptionFig: "Fig. 01",
    cardCaptionLabel: "Rooftop Terrace",
    description:
      "A rooftop carved from stone, reed and sea-light — where the Mediterranean is set at the table.",
  },
  {
    slug: "villa-faqra",
    order: 2,
    title: "Villa Faqra",
    tag: "Residential",
    location: "Mount Lebanon",
    area: "620 m²",
    year: "2023",
    imageFile: "cam03.jpg",
    cardCaptionFig: "Fig. 02",
    cardCaptionLabel: "Salon",
    description:
      "A mountain house held in one warm key — where every threshold is drawn to frame the valley beyond.",
  },
  {
    slug: "appartement-achrafieh",
    order: 3,
    title: "Appartement Achrafieh",
    tag: "Residential",
    location: "Beirut",
    area: "240 m²",
    year: "2024",
    imageFile: "cam05.jpg",
    cardCaptionFig: "Fig. 03",
    cardCaptionLabel: "Living",
    description:
      "A city apartment pared back to light, linen and aged brass — rooms that withhold, so the few things that matter can be seen.",
  },
  {
    slug: "maison-gemmayzeh",
    order: 4,
    title: "Maison Gemmayzeh",
    tag: "Restoration",
    location: "Beirut",
    area: "180 m²",
    year: "2023",
    imageFile: "cam11.png",
    cardCaptionFig: "Fig. 04",
    cardCaptionLabel: "The Corridor",
    description:
      "A heritage house brought back to itself — curved plaster, a single reed niche, and light kept low and deliberate.",
  },
  {
    slug: "penthouse-saifi",
    order: 5,
    title: "Penthouse Saifi",
    tag: "Residential",
    location: "Beirut",
    area: "310 m²",
    year: "2022",
    imageFile: "cam06.jpg",
    cardCaptionFig: "Fig. 05",
    cardCaptionLabel: "Bar",
    description:
      "Low, deliberate light and bespoke joinery, each run drawn and made for the room it belongs to.",
  },
  {
    slug: "riad-batroun",
    order: 6,
    title: "Riad Batroun",
    tag: "Hospitality",
    location: "Batroun",
    area: "880 m²",
    year: "2020",
    imageFile: "cam01.jpg",
    cardCaptionFig: "Fig. 06",
    cardCaptionLabel: "Courtyard",
    description:
      "Crazy-paved travertine and woven shade gathered around a courtyard of water and slow Mediterranean light.",
  },
];

async function seedProjects(imageField: ReturnType<typeof makeImageField>) {
  for (const p of PROJECTS) {
    await client.createOrReplace({
      _id: `project-${p.slug}`,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      tag: p.tag,
      location: p.location,
      area: p.area,
      year: p.year,
      order: p.order,
      cardImage: imageField(p.imageFile, p.title),
      cardCaptionFig: p.cardCaptionFig,
      cardCaptionLabel: p.cardCaptionLabel,
      description: p.description,
    });
    console.log(`  upserted project-${p.slug}`);
  }
}

// --- Step 3: Terra Mare's pageBuilder (the one hand-written transform) ---

function buildTerraMarePageBuilder(imageField: ReturnType<typeof makeImageField>) {
  const plate = (filename: string, alt: string, fig: string, label: string) => ({
    _type: "plate" as const,
    image: imageField(filename, alt),
    fig,
    label,
  });

  return [
    {
      _key: key(),
      _type: "caseStudyHero",
      eyebrow: "Rooftop Restaurant & Bar",
      titleLine1: "Son of",
      titleLine2: "a Fish",
      intro:
        "A rooftop carved from stone, reed and sea-light — where the Mediterranean is set at the table.",
      facts: [
        fact("Location", "Beirut, Lebanon"),
        fact("Typology", "Restaurant & Bar"),
        fact("Area", "740 m²"),
        fact("Year", "2024", true),
      ],
    },
    {
      _key: key(),
      _type: "fullBleedImage",
      plate: plate("cam07.jpg", "The Terrace", "Fig. 01", "The Terrace — West Sea View"),
      height: "clamp(440px, 90vh, 1020px)",
    },
    {
      _key: key(),
      _type: "overviewBlock",
      sectionNumber: "01",
      eyebrowLabel: "The Project",
      facts: [
        fact("Scope", "Interior Architecture"),
        fact("Detail", "Bespoke Joinery"),
        fact("Palette", "Stone · Reed · Terracotta"),
        fact("Status", "Completed", true),
      ],
      statement:
        "Seven hundred metres above the corniche, a room that withholds — so the sea can do the talking.",
      statementEmphasis: "withholds",
      body: "Hand-laid stone, woven reed ceilings, terracotta and crazy-paved travertine are held in a single warm key. Light is kept low and deliberate; every threshold, niche and run of joinery is drawn to frame a view, a material, or a pause.",
    },
    {
      _key: key(),
      _type: "beforeAfterBlock",
      sectionNumber: "02",
      eyebrowLabel: "The Threshold",
      dragLabel: "Drag — closed / open",
      before: plate("cam08.jpg", "Threshold closed", "", "Closed"),
      after: plate("cam09.jpg", "Threshold open", "", "Open"),
      caption: "Fig. 02 / 03",
    },
    {
      _key: key(),
      _type: "fullBleedImage",
      plate: plate("cam03.jpg", "The Dining Room", "Fig. 04", "The Dining Room"),
    },
    {
      _key: key(),
      _type: "twoUpImageBlock",
      sectionNumber: "03",
      eyebrowLabel: "The Bar",
      left: plate("cam05.jpg", "The Round Bar", "Fig. 05", "Round Bar"),
      right: plate("cam06.jpg", "The Long Bar", "Fig. 06", "Long Bar"),
      leftAspectRatio: "1.438",
      rightAspectRatio: "1.438",
    },
    {
      _key: key(),
      _type: "twoUpImageBlock",
      left: plate("cam12.png", "Ablutions", "Fig. 07", "Ablutions"),
      right: plate("cam04.png", "Candle Alcove", "Fig. 08", "Candle Alcove"),
      leftAspectRatio: "0.896",
      rightAspectRatio: "0.896",
    },
    {
      _key: key(),
      _type: "quotePortraitBlock",
      quote: "Luxury is what remains when nothing is excessive.",
      quoteEmphasis: "when nothing",
      portrait: plate("cam13.png", "Powder Room", "Fig. 09", "Powder Room"),
    },
    {
      _key: key(),
      _type: "fullBleedImage",
      plate: plate("cam11.png", "The Corridor", "Fig. 10", "The Corridor"),
    },
    {
      _key: key(),
      _type: "textImageBlock",
      sectionNumber: "04",
      eyebrowLabel: "The Passage",
      heading: "Curved plaster and a single reed niche turn a corridor into a held breath.",
      plate: plate("cam10.png", "The Passage", "Fig. 11", "The Passage"),
    },
    {
      _key: key(),
      _type: "twoUpImageBlock",
      sectionNumber: "05",
      eyebrowLabel: "Arrival",
      metaLabel: "Day / Dusk",
      left: plate("cam01.jpg", "Arrival by day", "Fig. 12", "Day"),
      right: plate("cam02.jpg", "Arrival at dusk", "Fig. 13", "Dusk"),
      leftAspectRatio: "1.42",
      rightAspectRatio: "1.087",
    },
    {
      _key: key(),
      _type: "creditsBlock",
      sectionNumber: "06",
      eyebrowLabel: "Project Credits",
      credits: [
        fact("Design", "Studio Melanie Chlela"),
        fact("Visualisation", "In-house Render"),
        fact("Location", "Beirut, Lebanon"),
        fact("Year", "2024", true),
      ],
    },
  ];
}

// --- Step 4: singletons ---

async function seedSingletons(imageField: ReturnType<typeof makeImageField>) {
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    wordmark: "Melanie Chlela",
    footerCopyright: "© 2026 Studio Melanie Chlela",
    footerCoordinates: "N 33.89° · E 35.50°",
    inquireEmail: "studio@melaniechlela.com",
    inquireAddress: "Saifi Village, Rue Pasteur · Beirut · Lebanon",
    projectCounterTotal: 28,
  });
  console.log("  upserted siteSettings");

  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroEyebrow: "Interior Architecture",
    heroTitleLine1: "Melanie",
    heroTitleLine2: "Chlela",
    heroMetaLeft: "Est. Beirut",
    heroMetaRight: "Since 2009",
    heroImage: imageField("cam07.jpg", "Interior — Salon"),
    wallDividerText: "Interiors, Drawn to the Millimetre",
    philosophyHeading: "Luxury is what remains when nothing is excessive.",
    philosophyHeadingEmphasis: "when nothing",
    philosophyParagraph1:
      "Every project begins as a drawing — walls, light, and circulation resolved before a single material is named. The plan is not a step toward the space. The plan is the space.",
    philosophyParagraph2:
      "A Lebanese sensibility tempered by European restraint: warm stone, aged brass, linen and shadow. Rooms that withhold, so the few things that matter can finally be seen.",
    selectedWorkCount: 4,
    services: [
      {
        _key: key(),
        _type: "serviceItem",
        letter: "A",
        title: "Interior Architecture",
        description: "Structure, light, and circulation considered as one continuous drawing.",
      },
      {
        _key: key(),
        _type: "serviceItem",
        letter: "B",
        title: "Spatial Planning",
        description: "Plans resolved to the millimetre before a single wall is moved.",
      },
      {
        _key: key(),
        _type: "serviceItem",
        letter: "C",
        title: "Bespoke Joinery",
        description: "Cabinetry and millwork drawn and made for the room it belongs to.",
      },
      {
        _key: key(),
        _type: "serviceItem",
        letter: "D",
        title: "Art & Object Curation",
        description: "Pieces chosen with the patience of a collector, not a decorator.",
      },
      {
        _key: key(),
        _type: "serviceItem",
        letter: "E",
        title: "Project Direction",
        description:
          "From the first measurement to the final placement, held to one standard.",
      },
    ],
    inquireHeading: "Begin with a conversation.",
    inquireHeadingEmphasis: "conversation.",
  });
  console.log("  upserted homePage");

  await client.createOrReplace({
    _id: "worksPage",
    _type: "worksPage",
    mastheadEyebrow: "A Selection · 2020 — 2024",
    mastheadTitleLine1: "Selected",
    mastheadTitleLine2: "Works",
    mastheadIntro:
      "A small, considered body of interiors — each one drawn to the millimetre and held in a single warm key. Scroll slowly; every project opens in full.",
    closingEyebrow: "More on Request",
    closingHeading: "A fuller portfolio is shared in conversation.",
    closingHeadingEmphasis: "in conversation.",
  });
  console.log("  upserted worksPage");
}

async function main() {
  console.log("1. Uploading image assets...");
  const assetMap = await uploadAssets();
  const imageField = makeImageField(assetMap);

  console.log("2. Seeding project documents...");
  await seedProjects(imageField);

  console.log("3. Patching terra-mare's pageBuilder...");
  await client
    .patch("project-terra-mare")
    .set({ pageBuilder: buildTerraMarePageBuilder(imageField) })
    .commit();
  console.log("  patched project-terra-mare");

  console.log("4. Seeding singletons...");
  await seedSingletons(imageField);

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
