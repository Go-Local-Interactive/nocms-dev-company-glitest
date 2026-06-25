export interface NavLink {
  label: string;
  href?: string; // optional: a label-only dropdown parent has no href
  children?: NavLink[]; // recursive: supports legacy 3-level menus
  description?: string; // legacy menus don't set this; kept for the default config / authoring
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube" | "linkedin" | "x";
  href: string;
  label: string;
}

export const navigationLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Locations", href: "/storage-locations" },
  { label: "Sizes", href: "/size-guide" },
  { label: "Reserve", href: "/reserve-online" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Storage",
    links: [
      { label: "Find a Location", href: "/storage-locations" },
      { label: "Unit Sizes", href: "/size-guide" },
      { label: "Reserve a Unit", href: "/reserve-online" },
      { label: "Pay Online", href: "/pay-online" },
      { label: "Rent Online", href: "/rent-online" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Search", href: "/search" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Get in Touch",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Reserve Now", href: "/reserve-online" },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  { platform: "facebook", href: "#", label: "Follow us on Facebook" },
  { platform: "instagram", href: "#", label: "Follow us on Instagram" },
  { platform: "youtube", href: "#", label: "Subscribe on YouTube" },
];
