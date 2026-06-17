import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import OutlineButton from "@/components/OutlineButton";
import PagerLink from "@/components/PagerLink";
import CaptionChip from "@/components/CaptionChip";
import FactItem from "@/components/FactItem";
import Parallax from "@/components/Parallax";
import ScrollReveal from "@/components/ScrollReveal";
import ScrollProgress from "@/components/ScrollProgress";
import CursorLabel from "@/components/CursorLabel";
import FilmGrain from "@/components/FilmGrain";
import { projects, type Project } from "@/lib/projects";

const META_PROPS = {
  gap: 6,
  labelSize: 8.5,
  labelLetterSpacing: "0.24em",
  valueSize: 12.5,
  valueLetterSpacing: "normal",
} as const;

function FullBleedProject({ project, priority }: { project: Project; priority?: boolean }) {
  const [fig, label] = project.caption.split(" — ");

  return (
    <Link
      href={`/works/${project.slug}`}
      data-cursor-label="View Project"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        padding: "clamp(10px, 2vh, 28px) 0 clamp(56px, 9vh, 108px)",
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "0 clamp(24px, 6vw, 90px)" }}>
        <ScrollReveal
          as="figure"
          y={0}
          duration={1}
          style={{
            margin: 0,
            position: "relative",
            width: "100%",
            height: "clamp(420px, 78vh, 860px)",
            overflow: "hidden",
            background: "var(--image-bg)",
            border: "1px solid var(--line)",
          }}
        >
          <Parallax src={project.image} alt={project.name} priority={priority} sizes="100vw" />
          <span
            style={{
              position: "absolute",
              left: "clamp(22px, 4vw, 46px)",
              top: "clamp(22px, 4vw, 46px)",
              fontFamily: "var(--font-italiana), serif",
              fontSize: "clamp(54px, 8vw, 128px)",
              lineHeight: 0.8,
              color: "var(--caption-text)",
              mixBlendMode: "difference",
            }}
          >
            {project.n}
          </span>
          <CaptionChip fig={fig} label={label} style={{ left: "clamp(18px, 3vw, 34px)", bottom: 20 }} />
        </ScrollReveal>

        <div
          style={{
            padding: "clamp(28px, 4vh, 46px) 0 0",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
            gap: "clamp(28px, 6vw, 90px)",
            alignItems: "end",
          }}
        >
          <div>
            <ScrollReveal y={14} duration={0.9} style={{ marginBottom: 20 }}>
              <Eyebrow number={project.n} rule="left" label={project.tag} />
            </ScrollReveal>
            <ScrollReveal
              as="h2"
              y={18}
              duration={1}
              delay={0.05}
              style={{
                margin: 0,
                fontFamily: "var(--font-italiana), serif",
                fontWeight: 400,
                fontSize: "clamp(38px, 6vw, 98px)",
                lineHeight: 0.96,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              {project.name}
            </ScrollReveal>
          </div>
          <ScrollReveal y={18} duration={1} delay={0.12}>
            <p
              style={{
                margin: "0 0 26px",
                fontSize: "clamp(13.5px, 1.1vw, 15.5px)",
                lineHeight: 1.85,
                color: "var(--body)",
                maxWidth: 440,
              }}
            >
              {project.description}
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px 36px",
                borderTop: "1px solid var(--line)",
                paddingTop: 20,
              }}
            >
              <FactItem label="Location" value={project.location} {...META_PROPS} />
              <FactItem label="Area" value={project.area} {...META_PROPS} />
              <FactItem label="Year" value={project.year} accent {...META_PROPS} />
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  alignSelf: "flex-end",
                  marginLeft: "auto",
                  fontSize: 9.5,
                  letterSpacing: "0.24em",
                  color: "var(--g)",
                  textTransform: "uppercase",
                }}
              >
                View Project <span style={{ fontSize: 13 }}>↗</span>
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </Link>
  );
}

function TwoUpProject({ project, reverse = false }: { project: Project; reverse?: boolean }) {
  return (
    <section style={{ padding: "clamp(20px, 3vh, 44px) clamp(24px, 6vw, 90px) clamp(54px, 9vh, 108px)" }}>
      <Link
        href={`/works/${project.slug}`}
        data-cursor-label="View Project"
        style={{
          textDecoration: "none",
          color: "inherit",
          maxWidth: 1500,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: reverse
            ? "minmax(0, 0.82fr) minmax(0, 1.18fr)"
            : "minmax(0, 1.18fr) minmax(0, 0.82fr)",
          gap: "clamp(30px, 5vw, 80px)",
          alignItems: "center",
        }}
      >
        <ScrollReveal y={20} duration={1} delay={0.1} style={{ order: reverse ? 1 : 2 }}>
          <Eyebrow number={project.n} rule="left" label={project.tag} />
          <h2
            style={{
              margin: "20px 0 22px",
              fontFamily: "var(--font-italiana), serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4.4vw, 64px)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            {project.name}
          </h2>
          <p
            style={{
              margin: "0 0 26px",
              fontSize: "clamp(13.5px, 1.1vw, 15px)",
              lineHeight: 1.85,
              color: "var(--body)",
              maxWidth: 420,
            }}
          >
            {project.description}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px 34px",
              borderTop: "1px solid var(--line)",
              paddingTop: 18,
            }}
          >
            <FactItem label="Location" value={project.location} {...META_PROPS} />
            <FactItem label="Area" value={project.area} {...META_PROPS} />
            <FactItem label="Year" value={project.year} accent {...META_PROPS} />
          </div>
        </ScrollReveal>
        <ScrollReveal
          as="figure"
          y={24}
          duration={1}
          style={{
            order: reverse ? 2 : 1,
            margin: 0,
            position: "relative",
            aspectRatio: "1.2",
            overflow: "hidden",
            background: "var(--image-bg)",
            border: "1px solid var(--line)",
          }}
        >
          <Parallax
            src={project.image}
            alt={project.name}
            oversizeHeight={114}
            offsetTop={-7}
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          <CaptionChip style={{ left: 16, bottom: 14 }}>{project.caption}</CaptionChip>
        </ScrollReveal>
      </Link>
    </section>
  );
}

export default function WorksPage() {
  const [p1, p2, p3, p4, p5, p6] = projects;

  return (
    <div style={{ position: "relative", overflowX: "hidden", minHeight: "100vh" }}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header variant="works" />

      {/* MASTHEAD */}
      <section
        style={{
          padding: "clamp(100px, 15vh, 168px) clamp(24px, 6vw, 90px) clamp(40px, 7vh, 72px)",
        }}
      >
        <div style={{ maxWidth: 1500, margin: "0 auto" }}>
          <ScrollReveal y={14} duration={0.9} style={{ marginBottom: "clamp(24px, 3.6vh, 40px)" }}>
            <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label="A Selection · 2020 — 2024" />
          </ScrollReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 0.75fr)",
              gap: "clamp(28px, 6vw, 90px)",
              alignItems: "end",
            }}
          >
            <ScrollReveal
              as="h1"
              y={20}
              duration={1.1}
              style={{
                margin: 0,
                fontFamily: "var(--font-italiana), serif",
                fontWeight: 400,
                lineHeight: 0.88,
                letterSpacing: "-0.01em",
                fontSize: "clamp(56px, 9.4vw, 158px)",
              }}
            >
              <span style={{ display: "block", color: "var(--ink)" }}>Selected</span>
              <span style={{ display: "block", color: "var(--g)", marginLeft: "0.02em" }}>Works</span>
            </ScrollReveal>
            <ScrollReveal
              as="p"
              y={18}
              duration={1}
              delay={0.15}
              style={{
                margin: "0 0 clamp(8px, 1.6vh, 18px)",
                maxWidth: 420,
                fontSize: "clamp(14px, 1.2vw, 16px)",
                lineHeight: 1.8,
                letterSpacing: "0.015em",
                color: "var(--body)",
              }}
            >
              A small, considered body of interiors — each one drawn to the millimetre
              and held in a single warm key. Scroll slowly; every project opens in full.
            </ScrollReveal>
          </div>
        </div>
      </section>

      <FullBleedProject project={p1} priority />
      <TwoUpProject project={p2} />
      <TwoUpProject project={p3} reverse />
      <FullBleedProject project={p4} />
      <TwoUpProject project={p5} />
      <TwoUpProject project={p6} reverse />

      {/* CLOSING / INQUIRE */}
      <section
        style={{
          padding: "clamp(60px, 11vh, 130px) clamp(24px, 6vw, 90px)",
          borderTop: "1px solid var(--line)",
          textAlign: "center",
        }}
      >
        <ScrollReveal y={16} duration={0.9} style={{ marginBottom: 26 }}>
          <Eyebrow rule="both" label="More on Request" />
        </ScrollReveal>
        <ScrollReveal
          as="h2"
          y={20}
          duration={1}
          style={{
            margin: "0 auto",
            maxWidth: 900,
            fontFamily: "var(--font-italiana), serif",
            fontWeight: 400,
            fontSize: "clamp(34px, 5.4vw, 84px)",
            lineHeight: 1.02,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
          }}
        >
          A fuller portfolio is shared{" "}
          <span style={{ fontStyle: "italic", color: "var(--g)" }}>in conversation.</span>
        </ScrollReveal>
        <ScrollReveal y={16} duration={1} delay={0.12} style={{ marginTop: 34, display: "inline-block" }}>
          <OutlineButton href="/" padding="16px 32px">
            Request an Introduction
          </OutlineButton>
        </ScrollReveal>
      </section>

      {/* BACK PAGER */}
      <nav style={{ display: "grid", gridTemplateColumns: "1fr", borderTop: "1px solid var(--line)" }}>
        <PagerLink
          href="/"
          arrow="left"
          label="Return to Studio"
          title="Melanie Chlela"
          layout="row"
          padding="clamp(40px, 7vh, 80px) clamp(24px, 6vw, 90px)"
          gap="20px"
        />
      </nav>

      <Footer variant="page" />
    </div>
  );
}
