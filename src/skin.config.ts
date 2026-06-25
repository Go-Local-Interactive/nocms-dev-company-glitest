interface SkinConfig {
  brandName: string;
  logoUrl?: string;
  tagline: string;
  heroVariant: "video" | "search" | "image" | "simple";
  primaryFacilitySlug?: string;
  contactPhone?: string;
  contactEmail?: string;
  primaryAddress?: { line1: string; city: string; state: string; zip: string };
}

const skinConfig: SkinConfig = {
  brandName: "GLITest",
  logoUrl: "http://localhost:3000/cms/api/media/file/secloud-logo.webp?prefix=tenant%2Fgo-local-interactive%2Fcached-images",
  tagline: "Secure self-storage from GLITest.",
  heroVariant: "search",
};

export default skinConfig;
