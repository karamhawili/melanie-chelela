import styles from "./Footer.module.css";

interface FooterProps {
  variant: "home" | "page";
}

export default function Footer({ variant }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${styles[variant]}`}>
      <span>© 2026 Studio Melanie Chlela</span>
      {variant === "page" && <span>Interior Architecture — Beirut, Lebanon</span>}
      <span className={styles.coordinates}>N 33.89° · E 35.50°</span>
    </footer>
  );
}
