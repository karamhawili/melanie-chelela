import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Studio Melanie Chlela</span>
      <span className={styles.coordinates}>N 33.89° · E 35.50°</span>
    </footer>
  );
}
