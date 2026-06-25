import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { footerColumns, socialLinks, type FooterColumn as FooterColumnType } from "@/data/site-config";
import skinConfig from "@/skin.config";

interface FooterProps {
  brandName?: string;
  /** Brand logo image (header/footer); falls back to an initial-letter mark. */
  logoUrl?: string;
  columns?: FooterColumnType[];
  /** Imported policy/legal links → the right side of the copyright bar. */
  policy?: { label: string; href: string }[];
  contactInfo?: { phone?: string; email?: string; address?: string };
}

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
};

/**
 * Site-wide footer — ported to match `storage-theme-payload`'s LIGHT footer:
 * a white area with the nav link columns (black headings, primary links) + a
 * brand column (logo + name + address + social), a wide "Locations" row, and a
 * light (primary-light) copyright bar with the policy links. Brand/contact read
 * from skinConfig; the brand logo comes from the imported brand (passed in).
 * Tagged `data-nocms-component="footer"` + `data-role="brand-name"`.
 */
export function Footer({
  brandName = skinConfig.brandName,
  logoUrl = skinConfig.logoUrl,
  columns = footerColumns,
  policy,
  contactInfo,
}: FooterProps) {
  const addr = skinConfig.primaryAddress;
  const address =
    contactInfo?.address ?? (addr ? `${addr.line1}, ${addr.city}, ${addr.state} ${addr.zip}` : "");

  // Legacy renders "Locations" as its own wide row beneath the other columns.
  const locationsCol = columns.find((c) => /location/i.test(c.title));
  const navCols = columns.filter((c) => c !== locationsCol);

  return (
    <footer data-nocms-component="footer" className="bg-background text-text">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {navCols.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-base font-bold text-text mb-4" data-role="heading">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} className="text-primary text-base hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand column: logo + name + address + social */}
          <div>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} className="w-auto max-w-[200px] max-h-12 mb-4" data-role="media" />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center mb-4">
                <span className="text-white font-heading text-lg font-bold">{brandName.charAt(0)}</span>
              </div>
            )}
            <p data-role="brand-name" className="font-heading font-bold text-text">
              {brandName}
            </p>
            {address && <p className="text-muted text-base mt-1" data-role="subheading">{address}</p>}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform];
                  return Icon ? (
                    <a
                      key={social.platform}
                      href={social.href}
                      aria-label={social.label}
                      className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center hover:opacity-90 transition" data-role="cta"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {locationsCol && locationsCol.links.length > 0 && (
          <div className="mt-10">
            <h3 className="font-heading text-base font-bold text-text mb-4" data-role="heading-2">{locationsCol.title}</h3>
            {/* Legacy lists locations alphabetically (states A–Z, an "All …" entry
                last) and fills DOWN each column — CSS multi-column gives the
                column-major flow; the grid was filling row-major (out of order). */}
            <ul className="columns-2 md:columns-3 gap-x-12 max-w-4xl">
              {[...locationsCol.links]
                .sort((a, b) => {
                  const aAll = /^all\b/i.test(a.label);
                  const bAll = /^all\b/i.test(b.label);
                  if (aAll !== bAll) return aAll ? 1 : -1;
                  return a.label.localeCompare(b.label);
                })
                .map((link) => (
                  <li key={link.href + link.label} className="mb-2.5 break-inside-avoid">
                    <a href={link.href} className="text-primary text-base hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Copyright bar — legacy uses a light (primary-light) strip. */}
      <div className="bg-primary-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p data-role="copyright" className="text-sm text-text">
            &copy; Copyright {new Date().getFullYear()} {brandName}. All Rights Reserved.
          </p>
          {policy && policy.length > 0 && (
            <ul className="flex items-center gap-3">
              {policy.map((link, i) => (
                <li key={link.href + link.label} className="flex items-center gap-3">
                  {i > 0 && <span className="text-muted" aria-hidden="true" data-role="text">|</span>}
                  <a href={link.href} className="text-primary text-sm hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
