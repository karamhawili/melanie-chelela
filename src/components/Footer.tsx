import styles from "./Footer.module.css";

interface FooterProps {
  copyright?: string;
  coordinates?: string;
}

export default function Footer({
  copyright = "© 2026 Studio Melanie Chelela",
  coordinates = "N 33.89° · E 35.50°",
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <span>{copyright}</span>
      <span className={styles.coordinates}>{coordinates}</span>
    </footer>
  );
}
