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
import styles from "./page.module.css";

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
    <Link href={`/works/${project.slug}`} data-cursor-label="View Project" className={styles.fullBleedLink}>
      <div className={styles.fullBleedInner}>
        <ScrollReveal as="figure" y={0} duration={1} className={styles.fullBleedFigure}>
          <Parallax src={project.image} alt={project.name} priority={priority} sizes="100vw" />
          <span className={styles.numeral}>{project.n}</span>
          <CaptionChip fig={fig} label={label} style={{ left: "clamp(18px, 3vw, 34px)", bottom: 20 }} />
        </ScrollReveal>

        <div className={styles.fullBleedDetails}>
          <div>
            <ScrollReveal y={14} duration={0.9} className={styles.fullBleedEyebrowWrap}>
              <Eyebrow number={project.n} rule="left" label={project.tag} />
            </ScrollReveal>
            <ScrollReveal as="h2" y={18} duration={1} delay={0.05} className={styles.fullBleedTitle}>
              {project.name}
            </ScrollReveal>
          </div>
          <ScrollReveal y={18} duration={1} delay={0.12}>
            <p className={styles.fullBleedDescription}>{project.description}</p>
            <div className={styles.fullBleedMetaRow}>
              <FactItem label="Location" value={project.location} {...META_PROPS} />
              <FactItem label="Area" value={project.area} {...META_PROPS} />
              <FactItem label="Year" value={project.year} accent {...META_PROPS} />
              <span className={styles.viewProjectLink}>
                View Project <span className={styles.viewProjectArrow}>↗</span>
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
    <section className={styles.twoUpSection}>
      <Link
        href={`/works/${project.slug}`}
        data-cursor-label="View Project"
        className={`${styles.twoUpLink} ${reverse ? styles.twoUpLinkReverse : ""}`}
      >
        <ScrollReveal
          y={20}
          duration={1}
          delay={0.1}
          className={reverse ? styles.orderFirst : styles.orderLast}
        >
          <Eyebrow number={project.n} rule="left" label={project.tag} />
          <h2 className={styles.twoUpTitle}>{project.name}</h2>
          <p className={styles.twoUpDescription}>{project.description}</p>
          <div className={styles.twoUpMetaRow}>
            <FactItem label="Location" value={project.location} {...META_PROPS} />
            <FactItem label="Area" value={project.area} {...META_PROPS} />
            <FactItem label="Year" value={project.year} accent {...META_PROPS} />
          </div>
        </ScrollReveal>
        <ScrollReveal
          as="figure"
          y={24}
          duration={1}
          className={`${styles.twoUpFigure} ${reverse ? styles.orderLast : styles.orderFirst}`}
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
    <div className={styles.root}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header variant="works" />

      {/* MASTHEAD */}
      <section className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <ScrollReveal y={14} duration={0.9} className={styles.mastheadEyebrowWrap}>
            <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label="A Selection · 2020 — 2024" />
          </ScrollReveal>
          <div className={styles.mastheadGrid}>
            <ScrollReveal as="h1" y={20} duration={1.1} className={styles.mastheadTitle}>
              <span className={styles.mastheadTitleLine}>Selected</span>
              <span className={styles.mastheadTitleLineGold}>Works</span>
            </ScrollReveal>
            <ScrollReveal as="p" y={18} duration={1} delay={0.15} className={styles.mastheadIntro}>
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
      <section className={styles.closing}>
        <ScrollReveal y={16} duration={0.9} className={styles.closingEyebrowWrap}>
          <Eyebrow rule="both" label="More on Request" />
        </ScrollReveal>
        <ScrollReveal as="h2" y={20} duration={1} className={styles.closingHeading}>
          A fuller portfolio is shared <span className={styles.italicGold}>in conversation.</span>
        </ScrollReveal>
        <ScrollReveal y={16} duration={1} delay={0.12} className={styles.closingButtonWrap}>
          <OutlineButton href="/" padding="16px 32px">
            Request an Introduction
          </OutlineButton>
        </ScrollReveal>
      </section>

      {/* BACK PAGER */}
      <nav className={styles.pagerNav}>
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

      <Footer />
    </div>
  );
}
