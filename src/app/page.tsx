import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import OutlineButton from "@/components/OutlineButton";
import ScrollReveal from "@/components/ScrollReveal";
import FilmGrain from "@/components/FilmGrain";
import { projects } from "@/lib/projects";

const services = [
  {
    n: "A",
    title: "Interior Architecture",
    description:
      "Structure, light, and circulation considered as one continuous drawing.",
  },
  {
    n: "B",
    title: "Spatial Planning",
    description:
      "Plans resolved to the millimetre before a single wall is moved.",
  },
  {
    n: "C",
    title: "Bespoke Joinery",
    description:
      "Cabinetry and millwork drawn and made for the room it belongs to.",
  },
  {
    n: "D",
    title: "Art & Object Curation",
    description:
      "Pieces chosen with the patience of a collector, not a decorator.",
  },
  {
    n: "E",
    title: "Project Direction",
    description:
      "From the first measurement to the final placement, held to one standard.",
  },
] as const;

const ANCHOR_SCROLL_MARGIN = 80;

function PlanSvg() {
  return (
    <svg viewBox="0 0 400 290" style={{ width: "100%", height: "auto", display: "block" }}>
      <rect x="24" y="24" width="352" height="232" fill="none" stroke="#c9a96a" strokeWidth="2.4" strokeOpacity="0.85" />
      <rect x="31" y="31" width="338" height="218" fill="none" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.4" />
      <line x1="210" y1="31" x2="210" y2="170" stroke="#c9a96a" strokeWidth="1.6" strokeOpacity="0.7" />
      <line x1="210" y1="170" x2="369" y2="170" stroke="#c9a96a" strokeWidth="1.6" strokeOpacity="0.7" />
      <line x1="31" y1="158" x2="140" y2="158" stroke="#c9a96a" strokeWidth="1.6" strokeOpacity="0.7" />
      <path d="M140 158 A 40 40 0 0 1 140 118" fill="none" stroke="#c9a96a" strokeWidth="0.8" strokeOpacity="0.55" />
      <line x1="140" y1="158" x2="140" y2="118" stroke="#c9a96a" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="120" y1="24" x2="160" y2="24" strokeWidth="3" style={{ stroke: "var(--panel)" }} />
      <line x1="120" y1="22" x2="160" y2="22" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="120" y1="26" x2="160" y2="26" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="270" y1="24" x2="320" y2="24" strokeWidth="3" style={{ stroke: "var(--panel)" }} />
      <line x1="270" y1="22" x2="320" y2="22" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="270" y1="26" x2="320" y2="26" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.6" />
      <rect x="250" y="50" width="96" height="42" fill="none" stroke="#c9a96a" strokeWidth="0.8" strokeOpacity="0.45" />
      <circle cx="120" cy="210" r="26" fill="none" stroke="#c9a96a" strokeWidth="0.8" strokeOpacity="0.45" />
      <line x1="24" y1="276" x2="376" y2="276" stroke="#c9a96a" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="24" y1="271" x2="24" y2="281" stroke="#c9a96a" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="376" y1="271" x2="376" y2="281" stroke="#c9a96a" strokeWidth="0.6" strokeOpacity="0.55" />
      <text x="200" y="273" textAnchor="middle" fill="#c9a96a" fillOpacity="0.8" fontFamily="'Space Grotesk'" fontSize="9" letterSpacing="1">
        6.40
      </text>
    </svg>
  );
}

function PlanBadgeSvg() {
  return (
    <svg
      viewBox="0 0 120 80"
      style={{
        position: "absolute",
        top: -16,
        right: -16,
        width: 92,
        height: "auto",
        background: "var(--bg)",
        padding: 7,
        border: "1px solid rgba(201,169,106,0.22)",
      }}
    >
      <rect x="6" y="6" width="108" height="68" fill="none" stroke="#c9a96a" strokeWidth="1.3" strokeOpacity="0.7" />
      <line x1="64" y1="6" x2="64" y2="48" stroke="#c9a96a" strokeWidth="0.9" strokeOpacity="0.55" />
      <line x1="64" y1="48" x2="114" y2="48" stroke="#c9a96a" strokeWidth="0.9" strokeOpacity="0.55" />
    </svg>
  );
}

export default function HomePage() {
  const selectedWork = projects.slice(0, 4);

  return (
    <div
      style={{
        position: "relative",
        overflowX: "hidden",
        minHeight: "100vh",
        background:
          "radial-gradient(130% 90% at 50% -8%, rgba(201,169,106,0.22), transparent 60%), var(--bg)",
        backgroundAttachment: "fixed",
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <pattern id="mcHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#c9a96a" strokeWidth="0.6" strokeOpacity="0.35" />
          </pattern>
          <pattern id="mcHatchDense" width="4" height="4" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#c9a96a" strokeWidth="0.6" strokeOpacity="0.5" />
          </pattern>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          pointerEvents: "none",
          background:
            "radial-gradient(125% 112% at 50% 35%, transparent 58%, rgba(90,70,40,0.12))",
        }}
      />
      <FilmGrain blendMode="overlay" zIndex={41} />

      <Header variant="home" />

      <main style={{ paddingTop: 78, position: "relative", zIndex: 1 }}>
        {/* HERO */}
        <section
          id="top"
          style={{
            scrollMarginTop: ANCHOR_SCROLL_MARGIN,
            position: "relative",
            minHeight: "calc(100vh - 78px)",
            boxSizing: "border-box",
            padding: "clamp(48px, 8vh, 96px) clamp(40px, 7vw, 120px) clamp(48px, 7vh, 84px)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            alignItems: "start",
            gap: "clamp(40px, 6vw, 104px)",
          }}
        >
          <div style={{ position: "relative" }}>
            <ScrollReveal y={14} duration={0.9} style={{ marginBottom: 32 }}>
              <Eyebrow label="Interior Architecture" rule="left" ruleWidth={46} letterSpacing="0.4em" />
            </ScrollReveal>
            <ScrollReveal
              as="h1"
              y={20}
              duration={1.1}
              style={{
                margin: 0,
                fontFamily: "var(--font-italiana), serif",
                fontWeight: 500,
                lineHeight: 0.82,
                letterSpacing: "-0.02em",
                fontSize: "clamp(64px, 10.8vw, 208px)",
                color: "var(--ink)",
              }}
            >
              <span style={{ display: "block" }}>Melanie</span>
              <span style={{ display: "block", color: "var(--g)" }}>Chlela</span>
            </ScrollReveal>
            <ScrollReveal
              y={0}
              duration={1}
              delay={0.4}
              style={{
                marginTop: 36,
                display: "flex",
                alignItems: "center",
                gap: 15,
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--meta)",
                textTransform: "uppercase",
              }}
            >
              <span style={{ whiteSpace: "nowrap" }}>Est. Beirut</span>
              <span style={{ color: "rgba(201,169,106,0.6)" }}>/</span>
              <span style={{ whiteSpace: "nowrap" }}>Since 2009</span>
            </ScrollReveal>
          </div>

          <ScrollReveal
            y={30}
            duration={1.1}
            delay={0.25}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 500,
              justifySelf: "end",
            }}
          >
            <div style={{ position: "relative", border: "1px solid rgba(201,169,106,0.3)", padding: 13, background: "var(--frame)" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", background: "var(--ph)" }}>
                <Image
                  src="/projects/terra-mare/cam07.jpg"
                  alt="Interior — Salon"
                  fill
                  priority
                  sizes="(min-width: 768px) 500px, 100vw"
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 14, border: "1px solid rgba(255,255,255,0.16)", pointerEvents: "none" }} />
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: -48,
                bottom: -40,
                width: 208,
                border: "1px solid rgba(201,169,106,0.3)",
                padding: 16,
                background: "var(--panel)",
                zIndex: 3,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.26em", color: "var(--meta)", textTransform: "uppercase" }}>
                  Fig. 01 — Plan
                </span>
                <span style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--g)", fontVariantNumeric: "tabular-nums" }}>
                  1:50
                </span>
              </div>
              <PlanSvg />
            </div>
          </ScrollReveal>
        </section>

        {/* WALL DIVIDER */}
        <div
          style={{
            margin: "40px 0",
            height: 34,
            position: "relative",
            borderTop: "1px solid rgba(201,169,106,0.5)",
            borderBottom: "1px solid rgba(201,169,106,0.5)",
            background: "url(#mcHatch)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              padding: "0 18px",
              fontSize: 9,
              letterSpacing: "0.34em",
              color: "var(--meta)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              background: "var(--bg)",
            }}
          >
            Interiors, Drawn to the Millimetre
          </div>
        </div>

        {/* PHILOSOPHY */}
        <section id="philosophy" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, padding: "50px 6vw 80px", textAlign: "center" }}>
          <ScrollReveal y={16} duration={0.9} style={{ marginBottom: 30 }}>
            <Eyebrow number="01" label="Philosophy" />
          </ScrollReveal>
          <ScrollReveal
            as="h2"
            y={20}
            duration={1}
            delay={0.05}
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              fontFamily: "var(--font-italiana), serif",
              fontWeight: 400,
              fontSize: "clamp(30px, 4.6vw, 64px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            Luxury is what remains{" "}
            <span style={{ fontStyle: "italic", color: "var(--g)" }}>when nothing</span> is excessive.
          </ScrollReveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 50,
              maxWidth: 760,
              margin: "46px auto 0",
              textAlign: "left",
            }}
          >
            <ScrollReveal
              as="p"
              y={16}
              duration={0.9}
              delay={0.1}
              style={{ margin: 0, fontSize: 13, lineHeight: 1.95, color: "var(--body)" }}
            >
              Every project begins as a drawing — walls, light, and circulation resolved
              before a single material is named. The plan is not a step toward the space.
              The plan is the space.
            </ScrollReveal>
            <ScrollReveal
              as="p"
              y={16}
              duration={0.9}
              delay={0.18}
              style={{ margin: 0, fontSize: 13, lineHeight: 1.95, color: "var(--body)" }}
            >
              A Lebanese sensibility tempered by European restraint: warm stone, aged
              brass, linen and shadow. Rooms that withhold, so the few things that matter
              can finally be seen.
            </ScrollReveal>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section id="work" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, padding: "50px 6vw 90px" }}>
          <ScrollReveal y={16} duration={0.9} style={{ textAlign: "center", marginBottom: 56 }}>
            <Eyebrow number="02" label="Selected Work" />
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "64px 56px" }}>
            {selectedWork.map((project) => (
              <ScrollReveal key={project.slug} y={26} duration={1} style={{ position: "relative" }}>
                <div style={{ border: "1px solid rgba(201,169,106,0.28)", padding: 12, background: "var(--frame)" }}>
                  <div style={{ position: "relative", aspectRatio: "5 / 4", overflow: "hidden", background: "var(--ph)" }}>
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 13, border: "1px solid rgba(255,255,255,0.16)", pointerEvents: "none" }} />
                  </div>
                </div>
                <PlanBadgeSvg />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginTop: 20 }}>
                  <h3
                    style={{
                      margin: 0,
                      flex: "1 1 auto",
                      minWidth: 0,
                      fontFamily: "var(--font-italiana), serif",
                      fontWeight: 500,
                      fontSize: "clamp(22px, 2.4vw, 30px)",
                      lineHeight: 1.1,
                      color: "var(--ink)",
                    }}
                  >
                    {project.name}
                  </h3>
                  <span style={{ flex: "0 0 auto", fontSize: 11, letterSpacing: "0.16em", color: "var(--g)" }}>
                    {project.year}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "6px 14px",
                    marginTop: 12,
                    fontSize: 9.5,
                    letterSpacing: "0.14em",
                    color: "var(--meta)",
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap" }}>{project.location}</span>
                  <span style={{ color: "rgba(201,169,106,0.6)" }}>/</span>
                  <span style={{ whiteSpace: "nowrap" }}>{project.area}</span>
                  <span style={{ color: "rgba(201,169,106,0.6)" }}>/</span>
                  <span style={{ whiteSpace: "nowrap" }}>{project.tag}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal y={16} duration={0.9} style={{ display: "flex", justifyContent: "center", marginTop: 64 }}>
            <OutlineButton href="/works" suffix="/ 6" padding="16px 34px">
              View All Projects
            </OutlineButton>
          </ScrollReveal>
        </section>

        {/* APPROACH */}
        <section id="approach" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, padding: "50px 6vw 90px" }}>
          <ScrollReveal y={16} duration={0.9} style={{ textAlign: "center", marginBottom: 50 }}>
            <Eyebrow number="03" label="Approach" />
          </ScrollReveal>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {services.map((service) => (
              <ScrollReveal
                key={service.n}
                y={16}
                duration={0.9}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px minmax(0, 1fr) minmax(0, 1.2fr)",
                  gap: 28,
                  alignItems: "baseline",
                  padding: "24px 0",
                  borderTop: "1px solid rgba(201,169,106,0.12)",
                }}
              >
                <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--g)" }}>{service.n}</span>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-italiana), serif",
                    fontWeight: 400,
                    fontSize: "clamp(22px, 2.4vw, 32px)",
                    color: "var(--ink)",
                  }}
                >
                  {service.title}
                </h3>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.85, color: "var(--body)" }}>
                  {service.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* INQUIRE */}
        <section
          id="inquire"
          style={{
            scrollMarginTop: ANCHOR_SCROLL_MARGIN,
            padding: "80px 6vw 70px",
            textAlign: "center",
            position: "relative",
            borderTop: "1px solid rgba(201,169,106,0.18)",
          }}
        >
          <ScrollReveal y={16} duration={0.9} style={{ marginBottom: 28 }}>
            <Eyebrow number="04" label="Inquire" />
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
              fontSize: "clamp(44px, 7vw, 110px)",
              lineHeight: 0.98,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            Begin with a <span style={{ fontStyle: "italic", color: "var(--g)" }}>conversation.</span>
          </ScrollReveal>
          <ScrollReveal y={16} duration={1} delay={0.12} style={{ marginTop: 36 }}>
            <div style={{ fontFamily: "var(--font-italiana), serif", fontSize: 18, color: "var(--g)" }}>
              studio<span>@</span>melaniechlela.com
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 10.5,
                letterSpacing: "0.2em",
                color: "var(--meta)",
                textTransform: "uppercase",
              }}
            >
              Saifi Village, Rue Pasteur · Beirut · Lebanon
            </div>
            <div style={{ marginTop: 32 }}>
              <OutlineButton href="#top" padding="15px 30px">
                Request an Introduction
              </OutlineButton>
            </div>
          </ScrollReveal>
        </section>

        <Footer variant="home" />
      </main>
    </div>
  );
}
