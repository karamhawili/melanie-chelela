import type { Metadata } from "next";
import FilmGrain from "@/components/FilmGrain";
import PasswordField from "@/components/PasswordField";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { toSiteSettings, type RawSiteSettings } from "@/sanity/lib/adapters";
import { unlockSite } from "./actions";
import outlineButtonStyles from "@/components/OutlineButton.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Studio Melanie Chlela",
  description: "This site is currently available by invitation.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function EnterPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/";
  const hasError = params.error === "1";

  const { data: rawSettings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = toSiteSettings((rawSettings as RawSiteSettings | null) ?? {});
  const [emailUser, emailDomain] = (settings.inquireEmail || "").split("@");

  return (
    <div className={styles.root}>
      <FilmGrain blendMode="overlay" zIndex={41} />
      <div className={styles.panel}>
        <span className={styles.wordmark}>{settings.wordmark || "Melanie Chlela"}</span>

        <p className={styles.copy}>
          This site is currently available by invitation. Enter the password
          below to continue.
        </p>

        <form action={unlockSite} className={styles.form}>
          <input type="hidden" name="redirect" value={redirectTo} />
          <PasswordField />
          {hasError && (
            <p className={styles.error}>Incorrect password — please try again.</p>
          )}
          <button type="submit" className={`${outlineButtonStyles.button} ${styles.submit}`}>
            <span className={outlineButtonStyles.label}>Enter</span>
          </button>
        </form>

        {emailUser && emailDomain && (
          <p className={styles.contact}>
            Don&apos;t have a password? Email{" "}
            <a href={`mailto:${settings.inquireEmail}`} className={styles.contactLink}>
              {emailUser}
              <span>@</span>
              {emailDomain}
            </a>{" "}
            for access.
          </p>
        )}
      </div>
    </div>
  );
}
