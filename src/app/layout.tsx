import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { NoticeBar } from "@/components/layout/NoticeBar";
import { Footer } from "@/components/layout/Footer";
import { fetchTenantNav, fetchTenantNotice, fetchTenantLogo } from "@/lib/payload";
import { navItemsToLinks, navColumnsToFooterColumns, navItemsToPolicyLinks } from "@/lib/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GLITest", template: "%s | GLITest" },
  description: "Built with NoCMS",
};
// Inspector script is gated server-side by env (set only by the editor when
// spawning preview dev servers). The script self-no-ops without ?nocms-edit=1.
const editorOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Imported header nav off this site's tenant; fall back to the hardcoded
  // `navigationLinks` default (via undefined) when there's no usable nav.
  const nav = await fetchTenantNav();
  // Legacy renders the notice bar directly BELOW the header. IMPORT-dependent —
  // null (no bar) until the migration carries `tenant.siteWideNotice`.
  const notice = await fetchTenantNotice();
  // Header logo from the imported brand (nocms media route). Falls back to the
  // scaffold's skin.config logoUrl (Navbar default) when there's no brand logo.
  const logoUrl = await fetchTenantLogo();
  const headerLinks = nav?.header?.length ? navItemsToLinks(nav.header) : undefined;
  // `navColumnsToFooterColumns` may itself return [] (all imported columns
  // link-less); treat that as "no nav" so the Footer falls back to defaults.
  const footerColumns = nav?.footers?.length ? navColumnsToFooterColumns(nav.footers) : [];
  const policyLinks = nav?.policy?.length ? navItemsToPolicyLinks(nav.policy) : undefined;

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {editorOrigin && (
          <script async src={`${editorOrigin}/nocms/nocms-inspector.js`} />
        )}
      </head>
      <body className="font-body antialiased text-text bg-background">
        <Navbar links={headerLinks} logoUrl={logoUrl ?? undefined} />
        <NoticeBar notice={notice} />
        <main id="main-content">{children}</main>
        <Footer
          logoUrl={logoUrl ?? undefined}
          columns={footerColumns.length ? footerColumns : undefined}
          policy={policyLinks?.length ? policyLinks : undefined}
        />
      </body>
    </html>
  );
}
