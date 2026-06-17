import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import OutlineButton from "@/components/OutlineButton";
import ScrollReveal from "@/components/ScrollReveal";
import FilmGrain from "@/components/FilmGrain";
import Parallax from "@/components/Parallax";
import { projects } from "@/lib/projects";
import styles from "./page.module.css";

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

function PlanSvg() {
  return (
    <svg viewBox="0 0 400 290" className={styles.planSvg}>
      <rect x="24" y="24" width="352" height="232" fill="none" stroke="#c9a96a" strokeWidth="2.4" strokeOpacity="0.85" />
      <rect x="31" y="31" width="338" height="218" fill="none" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.4" />
      <line x1="210" y1="31" x2="210" y2="170" stroke="#c9a96a" strokeWidth="1.6" strokeOpacity="0.7" />
      <line x1="210" y1="170" x2="369" y2="170" stroke="#c9a96a" strokeWidth="1.6" strokeOpacity="0.7" />
      <line x1="31" y1="158" x2="140" y2="158" stroke="#c9a96a" strokeWidth="1.6" strokeOpacity="0.7" />
      <path d="M140 158 A 40 40 0 0 1 140 118" fill="none" stroke="#c9a96a" strokeWidth="0.8" strokeOpacity="0.55" />
      <line x1="140" y1="158" x2="140" y2="118" stroke="#c9a96a" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="120" y1="24" x2="160" y2="24" strokeWidth="3" className={styles.panelStroke} />
      <line x1="120" y1="22" x2="160" y2="22" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="120" y1="26" x2="160" y2="26" stroke="#c9a96a" strokeWidth="0.7" strokeOpacity="0.6" />
      <line x1="270" y1="24" x2="320" y2="24" strokeWidth="3" className={styles.panelStroke} />
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
    <svg viewBox="0 0 120 80" className={styles.planBadgeSvg}>
      <rect x="6" y="6" width="108" height="68" fill="none" stroke="#c9a96a" strokeWidth="1.3" strokeOpacity="0.7" />
      <line x1="64" y1="6" x2="64" y2="48" stroke="#c9a96a" strokeWidth="0.9" strokeOpacity="0.55" />
      <line x1="64" y1="48" x2="114" y2="48" stroke="#c9a96a" strokeWidth="0.9" strokeOpacity="0.55" />
    </svg>
  );
}

export default function HomePage() {
  const selectedWork = projects.slice(0, 4);

  return (
    <div className={styles.root}>
      <svg width="0" height="0" className={styles.hiddenSvg} aria-hidden="true">
        <defs>
          <pattern id="mcHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#c9a96a" strokeWidth="0.6" strokeOpacity="0.35" />
          </pattern>
        </defs>
      </svg>

      <div aria-hidden="true" className={styles.vignette} />
      <FilmGrain blendMode="overlay" zIndex={41} />

      <Header variant="home" />

      <main className={styles.main}>
        {/* HERO */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroLeft}>
            <ScrollReveal y={14} duration={0.9} className={styles.heroEyebrowWrap}>
              <Eyebrow label="Interior Architecture" rule="left" ruleWidth={46} letterSpacing="0.4em" />
            </ScrollReveal>
            <ScrollReveal as="h1" y={20} duration={1.1} className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Melanie</span>
              <span className={styles.heroTitleLineGold}>Chlela</span>
            </ScrollReveal>
            <ScrollReveal y={0} duration={1} delay={0.4} className={styles.heroMeta}>
              <span className={styles.nowrap}>Est. Beirut</span>
              <span className={styles.metaDivider}>/</span>
              <span className={styles.nowrap}>Since 2009</span>
            </ScrollReveal>
          </div>

          <ScrollReveal y={30} duration={1.1} delay={0.25} className={styles.heroPhotoWrap}>
            <div className={styles.photoFrame}>
              <div className={styles.photoInner}>
                <Parallax
                  src="/projects/terra-mare/cam07.jpg"
                  alt="Interior — Salon"
                  priority
                  sizes="(min-width: 768px) 500px, 100vw"
                />
                <div className={styles.insetBorder} style={{ inset: 14 }} />
              </div>
            </div>
            <div className={styles.planCard}>
              <div className={styles.planCardHeader}>
                <span className={styles.planCardLabel}>Fig. 01 — Plan</span>
                <span className={styles.planCardScale}>1:50</span>
              </div>
              <PlanSvg />
            </div>
          </ScrollReveal>
        </section>

        {/* WALL DIVIDER */}
        <div className={styles.wallDivider}>
          <div className={styles.wallDividerLabel}>Interiors, Drawn to the Millimetre</div>
        </div>

        {/* PHILOSOPHY */}
        <section id="philosophy" className={styles.philosophy}>
          <ScrollReveal y={16} duration={0.9} className={styles.philosophyEyebrowWrap}>
            <Eyebrow number="01" label="Philosophy" />
          </ScrollReveal>
          <ScrollReveal as="h2" y={20} duration={1} delay={0.05} className={styles.philosophyHeading}>
            Luxury is what remains <span className={styles.italicGold}>when nothing</span> is excessive.
          </ScrollReveal>
          <div className={styles.philosophyGrid}>
            <ScrollReveal as="p" y={16} duration={0.9} delay={0.1} className={styles.philosophyParagraph}>
              Every project begins as a drawing — walls, light, and circulation resolved
              before a single material is named. The plan is not a step toward the space.
              The plan is the space.
            </ScrollReveal>
            <ScrollReveal as="p" y={16} duration={0.9} delay={0.18} className={styles.philosophyParagraph}>
              A Lebanese sensibility tempered by European restraint: warm stone, aged
              brass, linen and shadow. Rooms that withhold, so the few things that matter
              can finally be seen.
            </ScrollReveal>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section id="work" className={styles.work}>
          <ScrollReveal y={16} duration={0.9} className={styles.workEyebrowWrap}>
            <Eyebrow number="02" label="Selected Work" />
          </ScrollReveal>
          <div className={styles.workGrid}>
            {selectedWork.map((project) => (
              <ScrollReveal key={project.slug} y={26} duration={1} className={styles.workCard}>
                <div className={styles.workCardFrame}>
                  <div className={styles.workCardImageInner}>
                    <Parallax
                      src={project.image}
                      alt={project.name}
                      oversizeHeight={114}
                      offsetTop={-7}
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className={styles.insetBorder} style={{ inset: 13 }} />
                  </div>
                </div>
                <PlanBadgeSvg />
                <div className={styles.workCardTitleRow}>
                  <h3 className={styles.workCardTitle}>{project.name}</h3>
                  <span className={styles.workCardYear}>{project.year}</span>
                </div>
                <div className={styles.workCardMeta}>
                  <span className={styles.nowrap}>{project.location}</span>
                  <span className={styles.metaDivider}>/</span>
                  <span className={styles.nowrap}>{project.area}</span>
                  <span className={styles.metaDivider}>/</span>
                  <span className={styles.nowrap}>{project.tag}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal y={16} duration={0.9} className={styles.workCta}>
            <OutlineButton href="/works" suffix="/ 6" padding="16px 34px">
              View All Projects
            </OutlineButton>
          </ScrollReveal>
        </section>

        {/* APPROACH */}
        <section id="approach" className={styles.approach}>
          <ScrollReveal y={16} duration={0.9} className={styles.approachEyebrowWrap}>
            <Eyebrow number="03" label="Approach" />
          </ScrollReveal>
          <div className={styles.approachList}>
            {services.map((service) => (
              <ScrollReveal key={service.n} y={16} duration={0.9} className={styles.serviceRow}>
                <span className={styles.serviceLetter}>{service.n}</span>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* INQUIRE */}
        <section id="inquire" className={styles.inquire}>
          <ScrollReveal y={16} duration={0.9} className={styles.inquireEyebrowWrap}>
            <Eyebrow number="04" label="Inquire" />
          </ScrollReveal>
          <ScrollReveal as="h2" y={20} duration={1} className={styles.inquireHeading}>
            Begin with a <span className={styles.italicGold}>conversation.</span>
          </ScrollReveal>
          <ScrollReveal y={16} duration={1} delay={0.12} className={styles.inquireContactWrap}>
            <div className={styles.email}>
              studio<span>@</span>melaniechlela.com
            </div>
            <div className={styles.address}>Saifi Village, Rue Pasteur · Beirut · Lebanon</div>
            <div className={styles.inquireButtonWrap}>
              <OutlineButton href="#top" padding="15px 30px">
                Request an Introduction
              </OutlineButton>
            </div>
          </ScrollReveal>
        </section>

        <Footer />
      </main>
    </div>
  );
}
