import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import HeaderToneSwitch from "@/components/HeaderToneSwitch";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import FactItem from "@/components/FactItem";
import CaptionChip from "@/components/CaptionChip";
import Parallax from "@/components/Parallax";
import BeforeAfter from "@/components/BeforeAfter";
import PlanFigure from "@/components/PlanFigure";
import PagerLink from "@/components/PagerLink";
import ProjectName from "@/components/ProjectName";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollProgress from "@/components/ScrollProgress";
import CursorLabel from "@/components/CursorLabel";
import FilmGrain from "@/components/FilmGrain";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import {
  toProject,
  toCaseStudyBlocks,
  toSiteSettings,
  type RawProject,
  type RawSiteSettings,
} from "@/sanity/lib/adapters";
import type {
  Fact,
  Plate,
  Project,
  CaseStudyBlock,
  FullBleedImageBlock,
  OverviewBlock,
  BeforeAfterBlock,
  TwoUpImageBlock,
  QuotePortraitBlock,
  TextImageBlock,
  PlansBlock,
  MaterialsBlock,
  FurnitureBlock,
  CreditsBlock,
  TitleLine,
} from "@/sanity/lib/types";
import styles from "./page.module.css";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({ query: PROJECT_SLUGS_QUERY });
  return (data as Array<{ slug: string }>).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: PROJECT_BY_SLUG_QUERY, params: { slug } });
  const raw = data as RawProject | null;
  if (!raw) return {};
  return {
    title: `${raw.seoTitle || raw.title} — Melanie Chelela`,
    description: raw.seoDescription || raw.description,
  };
}

/** Staggers a hero element's entrance: index × 0.12s after the curtain lifts. */
function introStyle(index: number): React.CSSProperties {
  return { "--i": index } as React.CSSProperties;
}

function withItalicPhrase(text: string, italic: string) {
  const [before, after] = text.split(italic);
  return (
    <>
      {before}
      <span className={styles.italicGold}>{italic}</span>
      {after}
    </>
  );
}

// --- Hero ---------------------------------------------------------------

interface HeroContent {
  eyebrow: string;
  title: TitleLine[];
  intro: string;
  facts: Fact[];
  plate: Plate;
}

/**
 * The hero is the case study's opening image with its text set over it. The
 * `caseStudyHero` block supplies the text; the `fullBleedImage` that follows
 * it (the opening plate in every case study so far) supplies the image and
 * is consumed, so it isn't drawn a second time below. A project without a
 * case study yet builds the same hero from its card fields.
 *
 * The title is the project's Display title. A hero block from before that
 * field existed may still carry its own two lines; they're used only when
 * the project has no Display title of its own.
 */
function extractHero(project: Project, blocks: CaseStudyBlock[]): { hero: HeroContent; rest: CaseStudyBlock[] } {
  const heroIndex = blocks.findIndex((b) => b._type === "caseStudyHero");
  const cardPlate: Plate = { src: project.image, alt: project.name, fig: "", label: project.caption };

  if (heroIndex === -1) {
    return {
      hero: {
        eyebrow: project.tag,
        title: project.titleLines,
        intro: project.description,
        facts: [
          { label: "Location", value: project.location },
          { label: "Area", value: project.area },
          { label: "Year", value: project.year, accent: true },
        ],
        plate: cardPlate,
      },
      rest: blocks,
    };
  }

  const heroBlock = blocks[heroIndex];
  if (heroBlock._type !== "caseStudyHero") throw new Error("unreachable");
  const following = blocks[heroIndex + 1];
  const openingPlate = following?._type === "fullBleedImage" ? following : null;

  const rest = blocks.filter((b, i) => i !== heroIndex && (openingPlate === null || i !== heroIndex + 1));

  const legacyTitle: TitleLine[] = [];
  if (heroBlock.titleLine1) legacyTitle.push({ text: heroBlock.titleLine1, style: "regular" });
  if (heroBlock.titleLine2) legacyTitle.push({ text: heroBlock.titleLine2, style: "gold" });

  return {
    hero: {
      eyebrow: heroBlock.eyebrow,
      title: !project.hasDisplayTitle && legacyTitle.length > 0 ? legacyTitle : project.titleLines,
      intro: heroBlock.intro,
      facts: heroBlock.facts,
      plate: openingPlate ? openingPlate.plate : cardPlate,
    },
    rest,
  };
}

function HeroSection({ hero }: { hero: HeroContent }) {
  return (
    <section className={styles.hero} data-header-sentinel="">
      <div className={styles.heroMedia}>
        <Parallax src={hero.plate.src} alt={hero.plate.alt} priority sizes="100vw" />
        <div aria-hidden="true" className={styles.heroShade} />
      </div>
      <div className={styles.heroContent}>
        <div>
          <div className={`${styles.intro} ${styles.heroEyebrowWrap}`} style={introStyle(0)}>
            <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={hero.eyebrow} />
          </div>
          <h1 className={`${styles.intro} ${styles.heroTitle}`} style={introStyle(1)}>
            <ProjectName lines={hero.title} />
          </h1>
        </div>
        <div className={styles.intro} style={introStyle(2)}>
          <p className={styles.heroIntro}>{hero.intro}</p>
          <div className={styles.heroFactsGrid}>
            {hero.facts.map((fact) => (
              <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Materials & Furniture ------------------------------------------------
//
// Each is a collage that fits one viewport: up to six items on a centred
// canvas, placed per nth-child in the stylesheet. A material is labelled
// beneath its swatch with its code, name and finish; a furniture piece stays
// wordless and names itself only as the cursor label on hover.

const COLLAGE_LIMIT = 6;

function MaterialsSection({ block }: { block: MaterialsBlock }) {
  return (
    <section className={styles.collageSection} aria-label="Materials">
      <div className={`${styles.collage} ${styles.materialsCollage}`}>
        {block.items.slice(0, COLLAGE_LIMIT).map((material, i) => (
          <ScrollReveal
            key={`${material.code}-${i}`}
            y={18}
            duration={1}
            delay={i * 0.07}
            className={`${styles.collageItem} ${styles.material}`}
          >
            <figure className={styles.materialFigure}>
              <div className={styles.swatchFrame}>
                <div className={styles.swatch} style={material.image ? undefined : { background: material.tone }}>
                  {material.image && (
                    <Image
                      src={material.image.src}
                      alt={material.image.alt}
                      fill
                      sizes="(min-width: 768px) 30vw, 45vw"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              </div>
              <figcaption className={styles.swatchCaption}>
                <span className={styles.swatchTitle}>
                  {material.code && <span className={styles.swatchCode}>{material.code}</span>}
                  <span className={styles.swatchName}>{material.name}</span>
                </span>
                {material.finish && <span className={styles.swatchFinish}>{material.finish}</span>}
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function FurnitureSection({ block }: { block: FurnitureBlock }) {
  return (
    <section className={styles.collageSection} aria-label="Furniture">
      <div className={`${styles.collage} ${styles.furnitureCollage}`}>
        {block.pieces.slice(0, COLLAGE_LIMIT).map((piece, i) => (
          <ScrollReveal
            key={`${piece.index}-${i}`}
            y={22}
            duration={1}
            delay={i * 0.07}
            className={`${styles.collageItem} ${styles.piece}`}
            data-cursor-label={[piece.name, piece.designer].filter(Boolean).join(" — ")}
          >
            <figure className={styles.pieceFigure}>
              <Parallax
                src={piece.image.src}
                alt={piece.image.alt}
                oversizeHeight={112}
                offsetTop={-6}
                sizes="(min-width: 768px) 30vw, 45vw"
              />
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// --- Plates & page-builder blocks ----------------------------------------

function FullBleedPlate({
  plate,
  height = "clamp(440px, 92vh, 1040px)",
  cursorLabel,
}: {
  plate: Plate;
  height?: string;
  cursorLabel: string;
}) {
  return (
    <figure data-cursor-label={cursorLabel} className={styles.fullBleedFigure} style={{ height }}>
      <Parallax src={plate.src} alt={plate.alt} sizes="100vw" />
      <CaptionChip fig={plate.fig} label={plate.label} style={{ left: "clamp(18px, 3vw, 34px)", bottom: 20 }} />
    </figure>
  );
}

function SimplePlate({
  plate,
  aspectRatio,
  cursorLabel,
  oversizeHeight = 114,
  offsetTop = -7,
  sizes,
  style,
}: {
  plate: Plate;
  aspectRatio: string;
  cursorLabel: string;
  oversizeHeight?: number;
  offsetTop?: number;
  sizes: string;
  style?: React.CSSProperties;
}) {
  return (
    <figure data-cursor-label={cursorLabel} className={styles.simpleFigure} style={{ aspectRatio, ...style }}>
      <Parallax src={plate.src} alt={plate.alt} oversizeHeight={oversizeHeight} offsetTop={offsetTop} sizes={sizes} />
      <CaptionChip style={{ left: 16, bottom: 14 }}>
        {plate.fig} — {plate.label}
      </CaptionChip>
    </figure>
  );
}

function FactGrid({ facts, maxWidth = 440 }: { facts: Fact[]; maxWidth?: number }) {
  return (
    <div className={styles.factGrid} style={{ maxWidth }}>
      {facts.map((fact) => (
        <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
      ))}
    </div>
  );
}

function FullBleedImageSection({ block }: { block: FullBleedImageBlock }) {
  return <FullBleedPlate plate={block.plate} height={block.height} cursorLabel={block.plate.label} />;
}

function OverviewSection({ block }: { block: OverviewBlock }) {
  return (
    <section className={styles.overview}>
      <div className={styles.overviewGrid}>
        <ScrollReveal y={18} duration={1}>
          <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel} />
          <div className={styles.overviewFactsWrap}>
            <FactGrid facts={block.facts} />
          </div>
        </ScrollReveal>
        <ScrollReveal y={22} duration={1} delay={0.1}>
          <h2 className={styles.overviewStatement}>
            {withItalicPhrase(block.statement, block.statementEmphasis)}
          </h2>
          <p className={styles.overviewBody}>{block.body}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function BeforeAfterSection({ block }: { block: BeforeAfterBlock }) {
  return (
    <section className={styles.threshold}>
      <div className={styles.thresholdInner}>
        <ScrollReveal y={16} duration={0.9} className={`${styles.sectionHeaderRow} ${styles.headerGap}`}>
          <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel} />
          <span className={styles.metaLabel}>{block.dragLabel}</span>
        </ScrollReveal>
        <ScrollReveal y={0} duration={1}>
          <BeforeAfter
            beforeSrc={block.before.src}
            beforeAlt={block.before.alt}
            beforeLabel={block.before.label}
            afterSrc={block.after.src}
            afterAlt={block.after.alt}
            afterLabel={block.after.label}
            caption={block.caption}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function TwoUpImageSection({ block }: { block: TwoUpImageBlock }) {
  const hasHeader = Boolean(block.sectionNumber || block.eyebrowLabel || block.metaLabel);
  return (
    <section className={styles.bar}>
      <div className={styles.barInner}>
        {hasHeader && (
          <ScrollReveal y={16} duration={0.9} className={`${styles.sectionHeaderRow} ${styles.headerGap}`}>
            <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel ?? ""} />
            {block.metaLabel && <span className={styles.metaLabel}>{block.metaLabel}</span>}
          </ScrollReveal>
        )}
        <div className={styles.barGrid}>
          <ScrollReveal y={24} duration={1}>
            <SimplePlate
              plate={block.left}
              aspectRatio={block.leftAspectRatio ?? "1.438"}
              cursorLabel={block.left.label}
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </ScrollReveal>
          <ScrollReveal y={24} duration={1} delay={0.08}>
            <SimplePlate
              plate={block.right}
              aspectRatio={block.rightAspectRatio ?? block.leftAspectRatio ?? "1.438"}
              cursorLabel={block.right.label}
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function QuotePortraitSection({ block }: { block: QuotePortraitBlock }) {
  return (
    <section className={styles.quoteSection}>
      <div className={styles.quoteGrid}>
        <ScrollReveal as="blockquote" y={20} duration={1} className={styles.quoteText}>
          {withItalicPhrase(block.quote, block.quoteEmphasis)}
        </ScrollReveal>
        <ScrollReveal y={24} duration={1} delay={0.1} className={styles.portraitWrap}>
          <SimplePlate
            plate={block.portrait}
            aspectRatio="0.547"
            cursorLabel={block.portrait.label}
            oversizeHeight={112}
            offsetTop={-6}
            sizes="300px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function TextImageSection({ block }: { block: TextImageBlock }) {
  return (
    <section className={styles.passage}>
      <div className={styles.passageGrid}>
        <ScrollReveal y={18} duration={1}>
          <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel} />
          <h3 className={styles.passageHeading}>{block.heading}</h3>
        </ScrollReveal>
        <ScrollReveal y={26} duration={1} delay={0.1}>
          <SimplePlate
            plate={block.plate}
            aspectRatio="0.896"
            cursorLabel={block.plate.label}
            oversizeHeight={112}
            offsetTop={-6}
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

// Drawings are never cropped: each frame takes the drawing's own
// proportions and the artwork is `contain`-fitted inside it. An image plan
// gets those proportions from Sanity's asset metadata; a PDF plan has none
// stored, so PlanFigure measures page one in the browser and swaps the
// fallback out. The CSS caps frame height, so a portrait plan's width
// follows from that cap instead of filling the column.
const PLAN_DEFAULT_RATIO: Record<number, number> = { 1: 1.7, 2: 1.3, 3: 1, 4: 0.95 };

function parseRatio(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function PlansSection({ block }: { block: PlansBlock }) {
  const count = Math.min(Math.max(block.plans.length, 1), 4);
  const hasHeader = Boolean(block.sectionNumber || block.eyebrowLabel || block.metaLabel);
  const overrideRatio = parseRatio(block.aspectRatio);
  const columnVw = Math.round(100 / count);

  return (
    <section className={styles.plans}>
      <div className={styles.plansInner}>
        {hasHeader && (
          <ScrollReveal y={16} duration={0.9} className={`${styles.sectionHeaderRow} ${styles.headerGap}`}>
            <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel ?? ""} />
            {block.metaLabel && <span className={styles.metaLabel}>{block.metaLabel}</span>}
          </ScrollReveal>
        )}
        <div
          className={styles.plansGrid}
          data-count={count}
          style={{ "--plan-count": count } as React.CSSProperties}
        >
          {block.plans.map((plan, i) => {
            const declaredRatio = overrideRatio ?? plan.aspectRatio;
            return (
              <ScrollReveal key={`${plan.src}-${i}`} y={24} duration={1} delay={i * 0.08}>
                <PlanFigure
                  plan={plan}
                  ratio={declaredRatio ?? PLAN_DEFAULT_RATIO[count]}
                  measurable={declaredRatio === undefined}
                  sizes={`(min-width: 1024px) ${columnVw}vw, (min-width: 480px) ${count >= 3 ? 50 : 100}vw, 100vw`}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CreditsSection({ block }: { block: CreditsBlock }) {
  return (
    <section className={styles.credits}>
      <div className={styles.creditsInner}>
        <ScrollReveal y={16} duration={0.9} className={styles.creditsEyebrowWrap}>
          <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel} />
        </ScrollReveal>
        <ScrollReveal y={18} duration={1} className={styles.creditsFactsRow}>
          {block.credits.map((credit) => (
            <FactItem key={credit.label} label={credit.label} value={credit.value} accent={credit.accent} />
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

function CaseStudyBuilder({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "fullBleedImage":
            return <FullBleedImageSection key={block._key} block={block} />;
          case "overviewBlock":
            return <OverviewSection key={block._key} block={block} />;
          case "beforeAfterBlock":
            return <BeforeAfterSection key={block._key} block={block} />;
          case "twoUpImageBlock":
            return <TwoUpImageSection key={block._key} block={block} />;
          case "quotePortraitBlock":
            return <QuotePortraitSection key={block._key} block={block} />;
          case "textImageBlock":
            return <TextImageSection key={block._key} block={block} />;
          case "plansBlock":
            return <PlansSection key={block._key} block={block} />;
          case "materialsBlock":
            return <MaterialsSection key={block._key} block={block} />;
          case "furnitureBlock":
            return <FurnitureSection key={block._key} block={block} />;
          case "creditsBlock":
            return <CreditsSection key={block._key} block={block} />;
          default:
            // The hero block is consumed by extractHero(); nothing else reaches here.
            return null;
        }
      })}
    </>
  );
}

function PlaceholderClosing() {
  return (
    <section className={styles.placeholderClosing}>
      <ScrollReveal y={16} duration={0.9} className={styles.placeholderClosingEyebrowWrap}>
        <Eyebrow rule="both" label="In Development" />
      </ScrollReveal>
      <ScrollReveal as="h2" y={20} duration={1} className={styles.placeholderClosingHeading}>
        The full case study for this project is{" "}
        <span className={styles.italicGold}>in development.</span>
      </ScrollReveal>
    </section>
  );
}

export default async function ProjectPage({ params }: PageParams) {
  const { slug } = await params;

  const [{ data: rawProjectData }, { data: rawProjectsData }, { data: rawSettingsData }] = await Promise.all([
    sanityFetch({ query: PROJECT_BY_SLUG_QUERY, params: { slug } }),
    sanityFetch({ query: PROJECTS_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const rawProject = rawProjectData as RawProject | null;
  const rawProjects = rawProjectsData as RawProject[];
  const rawSettings = rawSettingsData as RawSiteSettings | null;

  if (!rawProject) notFound();

  const project = toProject(rawProject);
  const blocks = toCaseStudyBlocks(rawProject.pageBuilder);
  const settings = toSiteSettings(rawSettings ?? {});

  const allProjects = rawProjects.map(toProject);
  const index = allProjects.findIndex((p) => p.slug === slug);
  const next = allProjects[(index + 1) % allProjects.length];

  const { hero, rest } = extractHero(project, blocks);

  return (
    <div className={styles.root}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header
        variant="project"
        tone="overlay"
        projectIndex={index + 1}
        projectTotal={settings.projectCounterTotal}
        wordmark={settings.wordmark}
      />
      <HeaderToneSwitch />

      <HeroSection hero={hero} />

      {blocks.length > 0 ? <CaseStudyBuilder blocks={rest} /> : <PlaceholderClosing />}

      <nav className={styles.pagerNav}>
        <PagerLink
          href="/works"
          arrow="left"
          label="Back to Work"
          title="All Projects"
          bordered
          padding="clamp(44px, 8vh, 92px) clamp(24px, 5vw, 72px)"
          gap="clamp(16px, 2.4vh, 26px)"
          titleSize="clamp(21px, 2.6vw, 34px)"
        />
        <PagerLink
          href={`/works/${next.slug}`}
          arrow="right"
          label="Next Project"
          title={<ProjectName lines={next.titleLines} />}
          align="end"
          padding="clamp(44px, 8vh, 92px) clamp(24px, 5vw, 72px)"
          gap="clamp(16px, 2.4vh, 26px)"
          titleSize="clamp(30px, 5.1vw, 72px)"
        />
      </nav>

      <Footer copyright={settings.footerCopyright} coordinates={settings.footerCoordinates} />
    </div>
  );
}
