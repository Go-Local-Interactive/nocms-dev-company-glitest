export interface SkinConfig {
  /** Brand / company name */
  brandName: string;
  /** Primary tagline */
  tagline: string;
  /** Hero layout variant */
  heroVariant: "video" | "search" | "image" | "simple";
  /** Default facility slug — used to deep-link reserve / rent CTAs to the right location */
  primaryFacilitySlug?: string;
  /** Customer-facing phone number */
  contactPhone?: string;
  /** Customer-facing email */
  contactEmail?: string;
  /** Primary mailing / business address */
  primaryAddress?: {
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
}

const skinConfig: SkinConfig = {
  brandName: "Acme Storage",
  tagline: "Climate-controlled, secure self-storage built for the way you actually store.",
  heroVariant: "search",
  primaryFacilitySlug: "acme-uptown-dallas",
  contactPhone: "(214) 555-0181",
  contactEmail: "hello@acmestorage.com",
  primaryAddress: {
    line1: "2300 N Field St",
    city: "Dallas",
    state: "TX",
    zip: "75201",
  },
};

export default skinConfig;
