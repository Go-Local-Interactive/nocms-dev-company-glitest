import { Phone, Mail, MapPin, ArrowUpRight, Facebook, Instagram, Youtube } from "lucide-react";
import { footerColumns, socialLinks, type FooterColumn as FooterColumnType } from "@/data/site-config";
import skinConfig from "@/skin.config";

interface FooterProps {
  brandName?: string;
  columns?: FooterColumnType[];
  /** Imported policy/legal links, rendered as a subtle row in the bottom bar.
   *  Undefined (the default) → no policy row, preserving today's footer. */
  policy?: { label: string; href: string }[];
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

/**
 * Site-wide footer. Ported from `storage-theme-payload`'s Footer — a
 * three-row footer: brand + contact strip, link columns, and bottom bar with
 * copyright + social. All Payload deps stripped; brand / contact info reads
 * from `skinConfig`. Tagged for the editor with
 * `data-nocms-component="footer"` on the root and `data-role="brand-name"`
 * on the brand text leaf.
 */
export function Footer({
  brandName = skinConfig.brandName,
  columns = footerColumns,
  policy,
  contactInfo,
}: FooterProps) {
  const phone = contactInfo?.phone ?? skinConfig.contactPhone ?? "";
  const email = contactInfo?.email ?? skinConfig.contactEmail ?? "";
  const addr = skinConfig.primaryAddress;
  const address = contactInfo?.address ?? (addr ? `${addr.line1}, ${addr.city}, ${addr.state} ${addr.zip}` : "");

  const iconMap: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
  };

  return (
    <footer data-nocms-component="footer" className="bg-rich-brown text-white/90 relative overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-10 mb-10 border-b border-white/10">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-heading text-lg font-bold">
                  {brandName.charAt(0)}
                </span>
              </div>
              <span
                data-role="brand-name"
                className="font-heading text-xl font-bold text-white tracking-tight"
              >
                {brandName}
              </span>
            </div>
            <p className="text-white/65 text-sm leading-relaxed" data-role="tagline">
              {skinConfig.tagline}
            </p>
          </div>
          <div className="text-sm text-white/65 space-y-2 lg:text-right">
            {address && (
              <div className="flex items-center gap-2 lg:justify-end">
                <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                {address}
              </div>
            )}
            {(phone || email) && (
              <div className="flex items-center gap-2 lg:justify-end">
                {phone && (
                  <>
                    <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-white transition-colors">
                      {phone}
                    </a>
                  </>
                )}
                {phone && email && <span className="mx-1">&middot;</span>}
                {email && (
                  <>
                    <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                      {email}
                    </a>
                  </>
                )}
              </div>
            )}
            <p className="text-white/50 text-xs">Mon&ndash;Fri: 9am&ndash;6pm &middot; Sat: 9am&ndash;5pm &middot; Sun: 10am&ndash;4pm</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold text-white tracking-wide uppercase mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 transition-all"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-2 text-center sm:text-left">
            <p data-role="copyright" className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {policy && policy.length > 0 && (
              <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                {policy.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-white/50 hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.platform];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.href}
                    className="h-9 w-9 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
