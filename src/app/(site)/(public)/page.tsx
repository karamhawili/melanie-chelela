import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import HeaderToneSwitch from "@/components/HeaderToneSwitch";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import OutlineButton from "@/components/OutlineButton";
import ScrollReveal from "@/components/ScrollReveal";
import FilmGrain from "@/components/FilmGrain";
import Parallax from "@/components/Parallax";
import CursorLabel from "@/components/CursorLabel";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY, HOME_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import {
  toProject,
  toHomePage,
  toSiteSettings,
  type RawProject,
  type RawHomePage,
  type RawSiteSettings,
} from "@/sanity/lib/adapters";
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

export default async function HomePage() {
  const [{ data: rawHomeData }, { data: rawProjectsData }, { data: rawSettingsData }] = await Promise.all([
    sanityFetch({ query: HOME_PAGE_QUERY }),
    sanityFetch({ query: PROJECTS_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const home = toHomePage((rawHomeData as RawHomePage | null) ?? {});
  const projects = (rawProjectsData as RawProject[]).map(toProject);
  const settings = toSiteSettings((rawSettingsData as RawSiteSettings | null) ?? {});

  const selectedWork = projects.slice(0, home.selectedWorkCount);
  const [emailUser, emailDomain] = settings.inquireEmail.split("@");

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
      <CursorLabel />

      <Header variant="home" tone="overlay" wordmark={settings.wordmark} />
      <HeaderToneSwitch />

      <main className={styles.main}>
        {/* HERO — a pinned full-viewport image; one quiet screen of it, then
            the Philosophy band scrolls over the same image before the page
            returns to ivory. */}
        <section id="top" className={styles.hero} data-header-sentinel="">
          <div className={styles.heroMedia}>
            <Image
              src={home.heroImage.src}
              alt={home.heroImage.alt}
              fill
              priority
              sizes="100vw"
              className={styles.heroImage}
              style={{ objectFit: "cover" }}
            />
            <div aria-hidden="true" className={styles.heroShade} />
          </div>

          <div className={styles.heroBody}>
            <div className={styles.heroIntro} />

            {/* PHILOSOPHY — still over the pinned image, which darkens beneath it. */}
            <div id="philosophy" className={styles.heroPhilosophy}>
              <ScrollReveal y={16} duration={0.9} className={styles.philosophyEyebrowWrap}>
                <Eyebrow number="01" label="Philosophy" />
              </ScrollReveal>
              <ScrollReveal as="h2" y={20} duration={1} delay={0.05} className={styles.philosophyHeading}>
                {withItalicPhrase(home.philosophyHeading, home.philosophyHeadingEmphasis)}
              </ScrollReveal>
              <div className={styles.philosophyGrid}>
                <ScrollReveal as="p" y={16} duration={0.9} delay={0.1} className={styles.philosophyParagraph}>
                  {home.philosophyParagraph1}
                </ScrollReveal>
                <ScrollReveal as="p" y={16} duration={0.9} delay={0.18} className={styles.philosophyParagraph}>
                  {home.philosophyParagraph2}
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* WALL DIVIDER — the seam back onto the ivory page. */}
        <div className={styles.wallDivider}>
          <div className={styles.wallDividerLabel}>{home.wallDividerText}</div>
        </div>

        {/* SELECTED WORK */}
        <section id="work" className={styles.work}>
          <ScrollReveal y={16} duration={0.9} className={styles.workEyebrowWrap}>
            <Eyebrow number="02" label="Selected Work" />
          </ScrollReveal>
          <div className={styles.workGrid}>
            {selectedWork.map((project) => (
              <Link
                key={project.slug}
                href={`/works/${project.slug}`}
                data-cursor-label="View Project"
                className={styles.workCardLink}
              >
                <ScrollReveal y={26} duration={1} className={styles.workCard}>
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
              </Link>
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
            {home.services.map((service) => (
              <ScrollReveal key={service.letter} y={16} duration={0.9} className={styles.serviceRow}>
                <span className={styles.serviceLetter}>{service.letter}</span>
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
            {withItalicPhrase(home.inquireHeading, home.inquireHeadingEmphasis)}
          </ScrollReveal>
          <ScrollReveal y={16} duration={1} delay={0.12} className={styles.inquireContactWrap}>
            <div className={styles.email}>
              {emailUser}
              <span>@</span>
              {emailDomain}
            </div>
            <div className={styles.address}>{settings.inquireAddress}</div>
            <div className={styles.inquireButtonWrap}>
              <OutlineButton href="#top" padding="15px 30px">
                Request an Introduction
              </OutlineButton>
            </div>
          </ScrollReveal>
        </section>

        <Footer copyright={settings.footerCopyright} coordinates={settings.footerCoordinates} />
      </main>
    </div>
  );
}
