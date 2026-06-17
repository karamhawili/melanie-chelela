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
import { projects, type Project } from "@/lib/projects";
import { caseStudies, type Plate, type Fact, type CaseStudyContent } from "@/lib/caseStudies";
import styles from "./page.module.css";

// Flavor text matching the source's "Project 01 / 28" counter — 28 implies a
// larger unpublished portfolio, it isn't meant to equal projects.length (6).
const PROJECT_TOTAL = 28;

interface PageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Melanie Chlela`,
    description: project.description,
  };
}

function FullBleedPlate({
  plate,
  height,
  cursorLabel,
  priority,
}: {
  plate: Plate;
  height: string;
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

function RichCaseStudy({ content }: { content: CaseStudyContent }) {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div>
            <ScrollReveal y={14} duration={0.9} className={styles.heroEyebrowWrap}>
              <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={content.heroEyebrow} />
            </ScrollReveal>
            <ScrollReveal as="h1" y={20} duration={1.1} className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>{content.heroTitleLine1}</span>
              <span className={styles.heroTitleLineGold}>{content.heroTitleLine2}</span>
            </ScrollReveal>
          </div>
          <ScrollReveal y={18} duration={1} delay={0.15} className={styles.heroIntroWrap}>
            <p className={styles.heroIntro}>{content.heroIntro}</p>
            <div className={styles.heroFactsGrid}>
              {content.heroFacts.map((fact) => (
                <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FullBleedPlate plate={content.lead} height="clamp(440px, 90vh, 1020px)" cursorLabel="The Terrace" priority />

      {/* OVERVIEW */}
      <section className={styles.overview}>
        <div className={styles.overviewGrid}>
          <ScrollReveal y={18} duration={1}>
            <Eyebrow number="01" rule="left" label="The Project" />
            <div className={styles.overviewFactsWrap}>
              <FactGrid facts={content.overviewFacts} />
            </div>
          </ScrollReveal>
          <ScrollReveal y={22} duration={1} delay={0.1}>
            <h2 className={styles.overviewStatement}>
              {withItalicPhrase(content.overviewStatement, content.overviewStatementItalic)}
            </h2>
            <p className={styles.overviewBody}>{content.overviewBody}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* THRESHOLD */}
      <section className={styles.threshold}>
        <div className={styles.thresholdInner}>
          <ScrollReveal
            y={16}
            duration={0.9}
            className={`${styles.sectionHeaderRow} ${styles.thresholdHeader}`}
          >
            <Eyebrow number="02" rule="left" label="The Threshold" />
            <span className={styles.metaLabel}>Drag — closed / open</span>
          </ScrollReveal>
          <ScrollReveal y={0} duration={1}>
            <BeforeAfter
              beforeSrc={content.threshold.before.src}
              beforeAlt={content.threshold.before.alt}
              beforeLabel={content.threshold.before.label}
              afterSrc={content.threshold.after.src}
              afterAlt={content.threshold.after.alt}
              afterLabel={content.threshold.after.label}
              caption={content.threshold.caption}
            />
          </ScrollReveal>
        </div>
      </section>

      <FullBleedPlate plate={content.dining} height="clamp(440px, 92vh, 1040px)" cursorLabel="The Dining Room" />

      {/* THE BAR */}
      <section className={styles.bar}>
        <div className={styles.barInner}>
          <ScrollReveal y={16} duration={0.9} className={styles.barEyebrowWrap}>
            <Eyebrow number="03" rule="left" label="The Bar" />
          </ScrollReveal>
          <div className={styles.barGrid}>
            <ScrollReveal y={24} duration={1}>
              <SimplePlate
                plate={content.bar[0]}
                aspectRatio="1.438"
                cursorLabel="The Round Bar"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </ScrollReveal>
            <ScrollReveal y={24} duration={1} delay={0.08}>
              <SimplePlate
                plate={content.bar[1]}
                aspectRatio="1.438"
                cursorLabel="The Long Bar"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className={styles.details}>
        <div className={styles.detailsGrid}>
          <ScrollReveal y={24} duration={1}>
            <SimplePlate
              plate={content.details[0]}
              aspectRatio="0.896"
              cursorLabel="Ablutions"
              oversizeHeight={112}
              offsetTop={-6}
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </ScrollReveal>
          <ScrollReveal y={24} duration={1} delay={0.08}>
            <SimplePlate
              plate={content.details[1]}
              aspectRatio="0.896"
              cursorLabel="Candle Alcove"
              oversizeHeight={112}
              offsetTop={-6}
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* QUOTE + PORTRAIT */}
      <section className={styles.quoteSection}>
        <div className={styles.quoteGrid}>
          <ScrollReveal as="blockquote" y={20} duration={1} className={styles.quoteText}>
            {withItalicPhrase(content.quote, content.quoteItalic)}
          </ScrollReveal>
          <ScrollReveal y={24} duration={1} delay={0.1} className={styles.portraitWrap}>
            <SimplePlate
              plate={content.portrait}
              aspectRatio="0.547"
              cursorLabel="Powder Room"
              oversizeHeight={112}
              offsetTop={-6}
              sizes="300px"
            />
          </ScrollReveal>
        </div>
      </section>

      <FullBleedPlate plate={content.corridor} height="clamp(440px, 92vh, 1040px)" cursorLabel="The Corridor" />

      {/* THE PASSAGE */}
      <section className={styles.passage}>
        <div className={styles.passageGrid}>
          <ScrollReveal y={18} duration={1}>
            <Eyebrow number="04" rule="left" label="The Passage" />
            <h3 className={styles.passageHeading}>{content.passage.heading}</h3>
          </ScrollReveal>
          <ScrollReveal y={26} duration={1} delay={0.1}>
            <SimplePlate
              plate={content.passage.plate}
              aspectRatio="0.896"
              cursorLabel="The Passage"
              oversizeHeight={112}
              offsetTop={-6}
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ARRIVAL */}
      <section className={styles.arrival}>
        <div className={styles.arrivalInner}>
          <ScrollReveal
            y={16}
            duration={0.9}
            className={`${styles.sectionHeaderRow} ${styles.arrivalHeader}`}
          >
            <Eyebrow number="05" rule="left" label="Arrival" />
            <span className={styles.metaLabel}>Day / Dusk</span>
          </ScrollReveal>
          <div className={styles.arrivalGrid}>
            <ScrollReveal y={24} duration={1}>
              <SimplePlate
                plate={content.arrival.day}
                aspectRatio="1.42"
                cursorLabel="Arrival — Day"
                oversizeHeight={112}
                offsetTop={-6}
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </ScrollReveal>
            <ScrollReveal y={24} duration={1} delay={0.08}>
              <SimplePlate
                plate={content.arrival.dusk}
                aspectRatio="1.087"
                cursorLabel="Arrival — Dusk"
                oversizeHeight={112}
                offsetTop={-6}
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CREDITS */}
      <section className={styles.credits}>
        <div className={styles.creditsInner}>
          <ScrollReveal y={16} duration={0.9} className={styles.creditsEyebrowWrap}>
            <Eyebrow number="06" rule="left" label="Project Credits" />
          </ScrollReveal>
          <ScrollReveal y={18} duration={1} delay={0.08} className={styles.creditsFactsRow}>
            {content.credits.map((fact) => (
              <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
            ))}
          </ScrollReveal>
        </div>
      </section>
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
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const content = caseStudies[slug];
  const next = projects[(index + 1) % projects.length];

  return (
    <div className={styles.root}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header variant="project" projectIndex={index + 1} projectTotal={PROJECT_TOTAL} />

      {content ? <RichCaseStudy content={content} /> : <PlaceholderCaseStudy project={project} />}

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

      <Footer />
    </div>
  );
}
