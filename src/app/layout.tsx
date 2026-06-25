import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchTenantNav } from "@/lib/payload";
import { navItemsToLinks, navColumnsToFooterColumns, navItemsToPolicyLinks } from "@/lib/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoCMS Site",
  description: "Built with NoCMS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Imported header nav off this site's tenant; fall back to the hardcoded
  // `navigationLinks` default (via undefined) when there's no usable nav.
  const nav = await fetchTenantNav();
  const headerLinks = nav?.header?.length ? navItemsToLinks(nav.header) : undefined;
  // `navColumnsToFooterColumns` may itself return [] (all imported columns
  // link-less); treat that as "no nav" so the Footer falls back to defaults.
  const footerColumns = nav?.footers?.length ? navColumnsToFooterColumns(nav.footers) : [];
  const policyLinks = nav?.policy?.length ? navItemsToPolicyLinks(nav.policy) : undefined;

  return (
    <html lang="en">
      <body className="font-body antialiased text-text bg-background">
        <Navbar links={headerLinks} />
        <main id="main-content">{children}</main>
        <Footer
          columns={footerColumns.length ? footerColumns : undefined}
          policy={policyLinks?.length ? policyLinks : undefined}
        />
      </body>
    </html>
  );
}
