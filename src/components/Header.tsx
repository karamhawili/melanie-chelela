import Link from "next/link";
import styles from "./Header.module.css";

interface HeaderProps {
  variant: "home" | "works" | "project";
  /** Shown as an inert "Project 01 / 28" label when variant is "project". */
  projectIndex?: number;
  projectTotal?: number;
}

const navItems = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Inquire", href: "#inquire" },
];

export default function Header({ variant, projectIndex, projectTotal }: HeaderProps) {
  const isHome = variant === "home";
  const isWorks = variant === "works";
  const isProject = variant === "project";

  return (
    <header className={`${styles.header} ${styles.translucent}`}>
      <Link href={isHome ? "#top" : "/"} className={styles.wordmarkLink}>
        <span className={styles.wordmark}>Melanie Chlela</span>
      </Link>

      {isHome && (
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
      )}

      {isProject && projectIndex != null && projectTotal != null && (
        <span className={styles.projectCounter}>
          Project {String(projectIndex).padStart(2, "0")} / {projectTotal}
        </span>
      )}

      <div className={styles.destinations}>
        {isHome ? (
          <span className={styles.currentLabel}>Studio</span>
        ) : (
          <Link href="/" className={styles.destinationLink}>
            Studio
          </Link>
        )}
        {isWorks ? (
          <span className={styles.currentLabel}>Selected Works</span>
        ) : (
          <Link href="/works" className={styles.destinationLink}>
            Selected Works
          </Link>
        )}
      </div>
    </header>
  );
}
