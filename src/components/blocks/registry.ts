import type { ReactNode } from "react";
import type { BlockProps } from "./types";

/** A block renderer can be either a sync or async (server) component. */
export type BlockRenderer = (props: BlockProps) => ReactNode | Promise<ReactNode>;

import { HeroBlock } from "./HeroBlock";
import { RentalStepsBlock } from "./RentalStepsBlock";
import { FeaturesGridBlock } from "./FeaturesGridBlock";
import { DividerBlock } from "./DividerBlock";
import { StorageResourcesBlock } from "./StorageResourcesBlock";
import { TestimonialBlock } from "./TestimonialBlock";
import { BlogArchiveBlock } from "./BlogArchiveBlock";
import { SearchCalloutBlock } from "./SearchCalloutBlock";

import {
  BannerBlock,
  FacilityBannerBlock,
  MediaOverlayBlock,
  CallToActionBlock,
  StorageDefenderBlock,
  ContentBlock,
  RowGroupBlock,
  CodeBlock,
  FaqBlock,
  ContactFormBlock,
  UnitsTableBlock,
  MediaBlockBlock,
  GalleryBlock,
  SizeGuideBlock,
  SizeGuidePreviewBlock,
  StorageTypesBlock,
  FeaturedLocationsBlock,
  MapLocationsBlock,
  SearchFormBlock,
  SpacerBlock,
} from "./Baseline";

/** Slug-keyed registry. Slug values MUST match Payload block slugs in
 *  `nocms/src/payload/blocks/atomic.ts`. Adding a new variant = define the
 *  Payload block there + register a renderer here. */
export const REGISTRY: Record<string, BlockRenderer> = {
  hero: HeroBlock,
  "rental-steps": RentalStepsBlock,
  "features-grid": FeaturesGridBlock,
  divider: DividerBlock,
  "storage-resources": StorageResourcesBlock,
  testimonial: TestimonialBlock,
  "blog-archive": BlogArchiveBlock,
  "search-callout": SearchCalloutBlock,

  banner: BannerBlock,
  "facility-banner": FacilityBannerBlock,
  "media-overlay": MediaOverlayBlock,
  "call-to-action": CallToActionBlock,
  "storage-defender": StorageDefenderBlock,
  content: ContentBlock,
  "row-group": RowGroupBlock,
  code: CodeBlock,
  faq: FaqBlock,
  "contact-form": ContactFormBlock,
  "units-table": UnitsTableBlock,
  "media-block": MediaBlockBlock,
  gallery: GalleryBlock,
  "size-guide": SizeGuideBlock,
  "size-guide-preview": SizeGuidePreviewBlock,
  "storage-types": StorageTypesBlock,
  "featured-locations": FeaturedLocationsBlock,
  "map-locations": MapLocationsBlock,
  "search-form": SearchFormBlock,
  spacer: SpacerBlock,
};
