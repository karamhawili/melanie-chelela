import Link from "next/link";
import styles from "./Header.module.css";

interface HeaderProps {
  variant: "home" | "works" | "project";
  /** Required when variant is "project". */
  projectIndex?: number;
  /** Required when variant is "project". */
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
  const isProject = variant === "project";

  return (
    <header className={`${styles.header} ${styles[variant]}`}>
      <Link
        href={isHome ? "#top" : "/"}
        className={styles.wordmarkLink}
        style={isProject ? { color: "#ffffff" } : undefined}
      >
        <span
          className={`${styles.wordmark} ${
            isHome ? styles.wordmarkHome : styles.wordmarkSub
          }`}
        >
          Melanie Chlela
        </span>
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

      {variant === "works" && (
        <div className={styles.worksRight}>
          <Link href="/" className={styles.studioLink}>
            Studio
          </Link>
          <span className={styles.currentLabel}>Selected Works</span>
        </div>
      )}

      {isProject && (
        <div className={styles.projectRight}>
          <span className={styles.projectCounter}>
            Project {String(projectIndex).padStart(2, "0")} / {projectTotal}
          </span>
        </div>
      )}
    </header>
  );
}
