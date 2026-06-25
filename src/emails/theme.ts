/** Theme tokens consumed by every email block. Resolved at render time
 *  from the tenant's Brand doc (when present) with conservative fallbacks
 *  that work in every email client.
 *
 *  Why only system fonts as fallback: web fonts via <link> work in Apple Mail
 *  and Gmail iOS but silently fail in Outlook desktop and many corporate
 *  clients. Pinning the fallback to system stacks keeps the look consistent. */

export interface EmailTheme {
  brandName: string;
  logoUrl?: string;
  logoAlt?: string;
  primaryColor: string;
  textColor: string;
  bodyColor: string;
  mutedColor: string;
  borderColor: string;
  headingFont: string;
  bodyFont: string;
}

export const DEFAULT_THEME: EmailTheme = {
  brandName: "",
  primaryColor: "#0F172A",
  textColor: "#111111",
  bodyColor: "#F6F7F8",
  mutedColor: "#6B7280",
  borderColor: "#E5E7EB",
  headingFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  bodyFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
};

interface BrandDoc {
  name?: string;
  primaryColor?: string;
  textColor?: string;
  bodyColor?: string;
  headingFont?: string;
  bodyFont?: string;
  logo?: { url?: string; alt?: string } | string;
}

export function buildTheme(brand: BrandDoc | null | undefined, brandNameFallback: string): EmailTheme {
  const fontStack = (family: string | undefined, base: string) =>
    family ? `"${family}", ${base}` : base;

  const logo = typeof brand?.logo === "object" ? brand.logo : null;

  return {
    ...DEFAULT_THEME,
    brandName: brand?.name || brandNameFallback || "",
    logoUrl: logo?.url,
    logoAlt: logo?.alt || brand?.name || brandNameFallback,
    primaryColor: brand?.primaryColor || DEFAULT_THEME.primaryColor,
    textColor: brand?.textColor || DEFAULT_THEME.textColor,
    bodyColor: brand?.bodyColor || DEFAULT_THEME.bodyColor,
    headingFont: fontStack(brand?.headingFont, DEFAULT_THEME.headingFont),
    bodyFont: fontStack(brand?.bodyFont, DEFAULT_THEME.bodyFont),
  };
}
