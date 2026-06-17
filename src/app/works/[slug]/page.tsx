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
    <figure
      data-cursor-label={cursorLabel}
      style={{ margin: 0, position: "relative", width: "100%", height, overflow: "hidden", background: "var(--image-bg)" }}
    >
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
    <figure
      data-cursor-label={cursorLabel}
      style={{ margin: 0, position: "relative", aspectRatio, overflow: "hidden", background: "var(--image-bg)", ...style }}
    >
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
      <span style={{ fontStyle: "italic", color: "var(--g)" }}>{italic}</span>
      {after}
    </>
  );
}

function FactGrid({ facts, maxWidth = 440 }: { facts: Fact[]; maxWidth?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 30px", maxWidth }}>
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
      <section style={{ padding: "clamp(92px, 12vh, 146px) clamp(24px, 6vw, 90px) clamp(34px, 5vh, 56px)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.12fr) minmax(0, 0.88fr)",
            gap: "clamp(34px, 6vw, 96px)",
            alignItems: "end",
          }}
        >
          <div>
            <ScrollReveal y={14} duration={0.9} style={{ marginBottom: "clamp(20px, 3.2vh, 34px)" }}>
              <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={content.heroEyebrow} />
            </ScrollReveal>
            <ScrollReveal
              as="h1"
              y={20}
              duration={1.1}
              style={{
                margin: 0,
                fontFamily: "var(--font-italiana), serif",
                fontWeight: 400,
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
                fontSize: "clamp(44px, 7.4vw, 122px)",
              }}
            >
              <span style={{ display: "block", color: "var(--ink)" }}>{content.heroTitleLine1}</span>
              <span style={{ display: "block", color: "var(--g)", marginLeft: "0.03em" }}>
                {content.heroTitleLine2}
              </span>
            </ScrollReveal>
          </div>
          <ScrollReveal y={18} duration={1} delay={0.15} style={{ paddingBottom: "clamp(6px, 1.4vh, 16px)" }}>
            <p
              style={{
                margin: "0 0 30px",
                maxWidth: 430,
                fontSize: "clamp(14px, 1.25vw, 17px)",
                lineHeight: 1.75,
                letterSpacing: "0.015em",
                color: "var(--body)",
              }}
            >
              {content.heroIntro}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px 32px",
                borderTop: "1px solid var(--line)",
                paddingTop: 24,
              }}
            >
              {content.heroFacts.map((fact) => (
                <FactItem key={fact.label} label={fact.label} value={fact.value} accent={fact.accent} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <FullBleedPlate plate={content.lead} height="clamp(440px, 90vh, 1020px)" cursorLabel="The Terrace" priority />

      {/* OVERVIEW */}
      <section style={{ padding: "clamp(70px, 13vh, 150px) clamp(24px, 6vw, 90px)" }}>
        <div
          style={{
            maxWidth: 1340,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
            gap: "clamp(34px, 6vw, 110px)",
            alignItems: "start",
          }}
        >
          <ScrollReveal y={18} duration={1}>
            <Eyebrow number="01" rule="left" label="The Project" />
            <div style={{ marginTop: 24 }}>
              <FactGrid facts={content.overviewFacts} />
            </div>
          </ScrollReveal>
          <ScrollReveal y={22} duration={1} delay={0.1}>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-italiana), serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 3.7vw, 52px)",
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              {withItalicPhrase(content.overviewStatement, content.overviewStatementItalic)}
            </h2>
            <p style={{ margin: "30px 0 0", maxWidth: 560, fontSize: 13.5, lineHeight: 1.95, color: "var(--body)" }}>
              {content.overviewBody}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* THRESHOLD */}
      <section style={{ padding: "clamp(20px, 4vh, 60px) clamp(24px, 6vw, 90px) clamp(70px, 12vh, 140px)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto" }}>
          <ScrollReveal
            y={16}
            duration={0.9}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 26,
            }}
          >
            <Eyebrow number="02" rule="left" label="The Threshold" />
            <span style={{ fontSize: 9.5, letterSpacing: "0.2em", color: "var(--meta)", textTransform: "uppercase" }}>
              Drag — closed / open
            </span>
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
      <section style={{ padding: "clamp(60px, 11vh, 130px) clamp(24px, 6vw, 90px)" }}>
        <div style={{ maxWidth: 1500, margin: "0 auto" }}>
          <ScrollReveal y={16} duration={0.9} style={{ marginBottom: 32 }}>
            <Eyebrow number="03" rule="left" label="The Bar" />
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 2.4vw, 38px)" }}>
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
      <section style={{ padding: "clamp(20px, 3vh, 50px) clamp(24px, 6vw, 90px) clamp(60px, 11vh, 130px)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(16px, 2.4vw, 40px)",
          }}
        >
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
      <section style={{ padding: "clamp(40px, 8vh, 100px) clamp(24px, 6vw, 90px) clamp(60px, 11vh, 130px)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 0.7fr)",
            gap: "clamp(32px, 6vw, 90px)",
            alignItems: "center",
          }}
        >
          <ScrollReveal
            as="blockquote"
            y={20}
            duration={1}
            style={{
              margin: 0,
              fontFamily: "var(--font-italiana), serif",
              fontWeight: 400,
              fontSize: "clamp(30px, 4.6vw, 68px)",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            {withItalicPhrase(content.quote, content.quoteItalic)}
          </ScrollReveal>
          <ScrollReveal y={24} duration={1} delay={0.1} style={{ justifySelf: "end", width: "100%", maxWidth: 300 }}>
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
      <section style={{ padding: "clamp(60px, 11vh, 130px) clamp(24px, 6vw, 90px)" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.78fr) minmax(0, 1fr)",
            gap: "clamp(32px, 6vw, 96px)",
            alignItems: "center",
          }}
        >
          <ScrollReveal y={18} duration={1}>
            <Eyebrow number="04" rule="left" label="The Passage" />
            <h3
              style={{
                margin: "22px 0 0",
                fontFamily: "var(--font-italiana), serif",
                fontWeight: 400,
                fontSize: "clamp(26px, 3vw, 44px)",
                lineHeight: 1.14,
                color: "var(--ink)",
              }}
            >
              {content.passage.heading}
            </h3>
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
      <section style={{ padding: "clamp(20px, 3vh, 50px) clamp(24px, 6vw, 90px) clamp(70px, 12vh, 140px)" }}>
        <div style={{ maxWidth: 1500, margin: "0 auto" }}>
          <ScrollReveal
            y={16}
            duration={0.9}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 30,
            }}
          >
            <Eyebrow number="05" rule="left" label="Arrival" />
            <span style={{ fontSize: 9.5, letterSpacing: "0.2em", color: "var(--meta)", textTransform: "uppercase" }}>
              Day / Dusk
            </span>
          </ScrollReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.42fr 1.087fr",
              gap: "clamp(16px, 2.4vw, 38px)",
              alignItems: "stretch",
            }}
          >
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
      <section style={{ padding: "clamp(50px, 9vh, 110px) clamp(24px, 6vw, 90px) clamp(72px, 12vh, 140px)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto" }}>
          <ScrollReveal y={16} duration={0.9} style={{ marginBottom: 28 }}>
            <Eyebrow number="06" rule="left" label="Project Credits" />
          </ScrollReveal>
          <ScrollReveal
            y={18}
            duration={1}
            delay={0.08}
            style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px, 4vw, 72px)" }}
          >
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
      <section style={{ padding: "clamp(92px, 12vh, 146px) clamp(24px, 6vw, 90px) clamp(34px, 5vh, 56px)" }}>
        <ScrollReveal y={14} duration={0.9} style={{ marginBottom: "clamp(20px, 3.2vh, 34px)" }}>
          <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={project.tag} />
        </ScrollReveal>
        <ScrollReveal
          as="h1"
          y={20}
          duration={1.1}
          style={{
            margin: "0 0 30px",
            fontFamily: "var(--font-italiana), serif",
            fontWeight: 400,
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            fontSize: "clamp(44px, 7.4vw, 122px)",
            color: "var(--ink)",
          }}
        >
          {project.name}
        </ScrollReveal>
        <ScrollReveal y={18} duration={1} delay={0.1}>
          <p style={{ margin: "0 0 30px", maxWidth: 560, fontSize: "clamp(14px, 1.25vw, 17px)", lineHeight: 1.75, color: "var(--body)" }}>
            {project.description}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px 32px",
              borderTop: "1px solid var(--line)",
              paddingTop: 24,
              maxWidth: 560,
            }}
          >
            <FactItem label="Location" value={project.location} />
            <FactItem label="Area" value={project.area} />
            <FactItem label="Year" value={project.year} accent />
          </div>
        </ScrollReveal>
      </section>

      <figure
        data-cursor-label={project.name}
        style={{
          margin: 0,
          position: "relative",
          width: "100%",
          height: "clamp(440px, 90vh, 1020px)",
          overflow: "hidden",
          background: "var(--image-bg)",
        }}
      >
        <Parallax src={project.image} alt={project.name} priority sizes="100vw" />
        <CaptionChip>{project.caption}</CaptionChip>
      </figure>

      <section style={{ padding: "clamp(70px, 13vh, 150px) clamp(24px, 6vw, 90px)", textAlign: "center" }}>
        <ScrollReveal y={16} duration={0.9} style={{ marginBottom: 26 }}>
          <Eyebrow rule="both" label="In Development" />
        </ScrollReveal>
        <ScrollReveal
          as="h2"
          y={20}
          duration={1}
          style={{
            margin: "0 auto",
            maxWidth: 700,
            fontFamily: "var(--font-italiana), serif",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 48px)",
            lineHeight: 1.12,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}
        >
          The full case study for this project is{" "}
          <span style={{ fontStyle: "italic", color: "var(--g)" }}>in development.</span>
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
    <div style={{ position: "relative", overflowX: "hidden", minHeight: "100vh" }}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header variant="project" projectIndex={index + 1} projectTotal={PROJECT_TOTAL} />

      {content ? <RichCaseStudy content={content} /> : <PlaceholderCaseStudy project={project} />}

      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 0.82fr) minmax(0, 1.18fr)",
          borderTop: "1px solid var(--line)",
        }}
      >
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

      <Footer variant="page" />
    </div>
  );
}
