import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import FactItem from "@/components/FactItem";
import CaptionChip from "@/components/CaptionChip";
import Parallax from "@/components/Parallax";
import BeforeAfter from "@/components/BeforeAfter";
import PagerLink from "@/components/PagerLink";
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
  CaseStudyHeroBlock,
  FullBleedImageBlock,
  OverviewBlock,
  BeforeAfterBlock,
  TwoUpImageBlock,
  QuotePortraitBlock,
  TextImageBlock,
  CreditsBlock,
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

function FullBleedPlate({
  plate,
  height = "clamp(440px, 92vh, 1040px)",
  cursorLabel,
  priority,
}: {
  plate: Plate;
  height?: string;
  cursorLabel: string;
  priority?: boolean;
}) {
  return (
    <figure data-cursor-label={cursorLabel} className={styles.fullBleedFigure} style={{ height }}>
      <Parallax src={plate.src} alt={plate.alt} priority={priority} sizes="100vw" />
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

function FactGrid({ facts, maxWidth = 440 }: { facts: Fact[]; maxWidth?: number }) {
  return (
    <div className={styles.factGrid} style={{ maxWidth }}>
      {facts.map((fact) => (
        <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
      ))}
    </div>
  );
}

// --- One render component per page-builder block type ---

function CaseStudyHeroSection({ block }: { block: CaseStudyHeroBlock }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        <div>
          <ScrollReveal y={14} duration={0.9} className={styles.heroEyebrowWrap}>
            <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={block.eyebrow} />
          </ScrollReveal>
          <ScrollReveal as="h1" y={20} duration={1.1} className={styles.heroTitle}>
            <span className={styles.heroTitleLine}>{block.titleLine1}</span>
            <span className={styles.heroTitleLineGold}>{block.titleLine2}</span>
          </ScrollReveal>
        </div>
        <ScrollReveal y={18} duration={1} delay={0.15} className={styles.heroIntroWrap}>
          <p className={styles.heroIntro}>{block.intro}</p>
          <div className={styles.heroFactsGrid}>
            {block.facts.map((fact) => (
              <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function FullBleedImageSection({ block }: { block: FullBleedImageBlock }) {
  return (
    <FullBleedPlate plate={block.plate} height={block.height} cursorLabel={block.plate.label} />
  );
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
        <ScrollReveal y={16} duration={0.9} className={`${styles.sectionHeaderRow} ${styles.thresholdHeader}`}>
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
          <ScrollReveal y={16} duration={0.9} className={styles.sectionHeaderRow}>
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

function CreditsSection({ block }: { block: CreditsBlock }) {
  return (
    <section className={styles.credits}>
      <div className={styles.creditsInner}>
        <ScrollReveal y={16} duration={0.9} className={styles.creditsEyebrowWrap}>
          <Eyebrow number={block.sectionNumber} rule="left" label={block.eyebrowLabel} />
        </ScrollReveal>
        <ScrollReveal y={18} duration={1} delay={0.08} className={styles.creditsFactsRow}>
          {block.credits.map((fact) => (
            <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
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
          case "caseStudyHero":
            return <CaseStudyHeroSection key={block._key} block={block} />;
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
          case "creditsBlock":
            return <CreditsSection key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}

function PlaceholderCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <section className={styles.placeholderHero}>
        <ScrollReveal y={14} duration={0.9} className={styles.placeholderEyebrowWrap}>
          <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={project.tag} />
        </ScrollReveal>
        <ScrollReveal as="h1" y={20} duration={1.1} className={styles.placeholderTitle}>
          {project.name}
        </ScrollReveal>
        <ScrollReveal y={18} duration={1} delay={0.1}>
          <p className={styles.placeholderIntro}>{project.description}</p>
          <div className={styles.placeholderFactsGrid}>
            <FactItem label="Location" value={project.location} />
            <FactItem label="Area" value={project.area} />
            <FactItem label="Year" value={project.year} accent />
          </div>
        </ScrollReveal>
      </section>

      <figure data-cursor-label={project.name} className={styles.placeholderFigure}>
        <Parallax src={project.image} alt={project.name} priority sizes="100vw" />
        <CaptionChip>{project.caption}</CaptionChip>
      </figure>

      <section className={styles.placeholderClosing}>
        <ScrollReveal y={16} duration={0.9} className={styles.placeholderClosingEyebrowWrap}>
          <Eyebrow rule="both" label="In Development" />
        </ScrollReveal>
        <ScrollReveal as="h2" y={20} duration={1} className={styles.placeholderClosingHeading}>
          The full case study for this project is{" "}
          <span className={styles.italicGold}>in development.</span>
        </ScrollReveal>
      </section>
    </>
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

  return (
    <div className={styles.root}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header
        variant="project"
        projectIndex={index + 1}
        projectTotal={settings.projectCounterTotal}
        wordmark={settings.wordmark}
      />

      {blocks.length > 0 ? <CaseStudyBuilder blocks={blocks} /> : <PlaceholderCaseStudy project={project} />}

      <nav className={styles.pagerNav}>
        <PagerLink
          href="/works"
          arrow="left"
          label="Back to Work"
          title="All Projects"
          bordered
          padding="clamp(44px, 8vh, 92px) clamp(24px, 5vw, 72px)"
          gap="clamp(16px, 2.4vh, 26px)"
          titleSize="clamp(24px, 3vw, 40px)"
        />
        <PagerLink
          href={`/works/${next.slug}`}
          arrow="right"
          label="Next Project"
          title={next.name}
          align="end"
          padding="clamp(44px, 8vh, 92px) clamp(24px, 5vw, 72px)"
          gap="clamp(16px, 2.4vh, 26px)"
          titleSize="clamp(34px, 6vw, 86px)"
        />
      </nav>

      <Footer copyright={settings.footerCopyright} coordinates={settings.footerCoordinates} />
    </div>
  );
}
