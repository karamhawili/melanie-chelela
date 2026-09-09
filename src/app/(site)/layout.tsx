import { SanityLive } from "@/sanity/lib/live";

// Public site pages only. <SanityLive /> lives here rather than in the
// root layout so it is not mounted on /studio — there, every published
// change (including an asset upload) would trigger router.refresh() and
// re-render the Studio.
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <SanityLive />
    </>
  );
}
