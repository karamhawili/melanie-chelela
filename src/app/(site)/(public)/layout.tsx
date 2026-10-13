import { Mrs_Saint_Delafield } from "next/font/google";
import LoadingSignature from "@/components/LoadingSignature";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { toSiteSettings, type RawSiteSettings } from "@/sanity/lib/adapters";
import styles from "./layout.module.css";

// Script face for the loading signature only; swap for an SVG of the real
// signature inside LoadingSignature once there is one.
const signature = Mrs_Saint_Delafield({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// The public pages (home, works, project) share the signature curtain. It
// mounts once per full page load, so it plays on a hard load and not again
// when moving between pages. The gate (/enter) sits outside this group.
export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = toSiteSettings((data as RawSiteSettings | null) ?? {});

  return (
    <div className={`${signature.variable} ${styles.shell}`}>
      <LoadingSignature name={settings.wordmark || "Melanie Chlela"} caption="Interior Architecture" />
      {children}
    </div>
  );
}
