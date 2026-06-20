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
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY, WORKS_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import {
  toProject,
  toWorksPage,
  toSiteSettings,
  type RawProject,
  type RawWorksPage,
  type RawSiteSettings,
} from "@/sanity/lib/adapters";
import type { Project } from "@/sanity/lib/types";
import styles from "./page.module.css";

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

export default async function WorksPage() {
  const [{ data: rawProjectsData }, { data: rawWorksPageData }, { data: rawSettingsData }] = await Promise.all([
    sanityFetch({ query: PROJECTS_QUERY }),
    sanityFetch({ query: WORKS_PAGE_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const projects = (rawProjectsData as RawProject[]).map(toProject);
  const worksPage = toWorksPage((rawWorksPageData as RawWorksPage | null) ?? {});
  const settings = toSiteSettings((rawSettingsData as RawSiteSettings | null) ?? {});

  return (
    <div className={styles.root}>
      <FilmGrain blendMode="multiply" zIndex={90} />
      <ScrollProgress />
      <CursorLabel />
      <Header variant="works" wordmark={settings.wordmark} />

      {/* MASTHEAD */}
      <section className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <ScrollReveal y={14} duration={0.9} className={styles.mastheadEyebrowWrap}>
            <Eyebrow rule="left" ruleWidth={48} letterSpacing="0.4em" label={worksPage.mastheadEyebrow} />
          </ScrollReveal>
          <div className={styles.mastheadGrid}>
            <ScrollReveal as="h1" y={20} duration={1.1} className={styles.mastheadTitle}>
              <span className={styles.mastheadTitleLine}>{worksPage.mastheadTitleLine1}</span>
              <span className={styles.mastheadTitleLineGold}>{worksPage.mastheadTitleLine2}</span>
            </ScrollReveal>
            <ScrollReveal as="p" y={18} duration={1} delay={0.15} className={styles.mastheadIntro}>
              {worksPage.mastheadIntro}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Full-bleed / two-up / two-up-reversed, repeating every 3 projects
          — generalizes the original 6-project layout to any project count,
          since the list is CMS-managed and can grow, shrink, or reorder. */}
      {projects.map((project, index) => {
        const position = index % 3;
        if (position === 0) {
          return <FullBleedProject key={project.slug} project={project} priority={index === 0} />;
        }
        return <TwoUpProject key={project.slug} project={project} reverse={position === 2} />;
      })}

      {/* CLOSING / INQUIRE */}
      <section className={styles.closing}>
        <ScrollReveal y={16} duration={0.9} className={styles.closingEyebrowWrap}>
          <Eyebrow rule="both" label={worksPage.closingEyebrow} />
        </ScrollReveal>
        <ScrollReveal as="h2" y={20} duration={1} className={styles.closingHeading}>
          {withItalicPhrase(worksPage.closingHeading, worksPage.closingHeadingEmphasis)}
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
          title="Melanie Chelela"
          layout="row"
          padding="clamp(40px, 7vh, 80px) clamp(24px, 6vw, 90px)"
          gap="20px"
        />
      </nav>

      <Footer copyright={settings.footerCopyright} coordinates={settings.footerCoordinates} />
    </div>
  );
}
