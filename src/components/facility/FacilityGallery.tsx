import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/Carousel";

/**
 * Facility gallery. Source: storage-theme-payload `src/components/FacilityGallery`
 * — strips the Payload `Media` type, the focal-point + image-cache utilities,
 * the Vimeo embed slide, and the next/image dependency on a remote-image
 * loader. Now accepts a plain `images: { src; alt? }[]`. Single-item gallery
 * renders a static figure; multi renders the local Carousel primitive.
 *
 * Editor contract: root tagged `data-nocms-component="facility-gallery"`.
 * The (optional) heading carries `data-role="heading"`; slides are
 * structural and don't need their own roles.
 */

interface FacilityGalleryImage {
  src: string;
  alt?: string;
}

interface FacilityGalleryProps {
  images: FacilityGalleryImage[];
  facilityName?: string;
  heading?: string;
  className?: string;
}

export function FacilityGallery({
  images,
  facilityName = "Storage facility",
  heading,
  className = "",
}: FacilityGalleryProps) {
  if (!images || images.length === 0) return null;

  const altOf = (img: FacilityGalleryImage, idx: number) =>
    img.alt ?? `${facilityName} - Image ${idx + 1}`;

  if (images.length === 1) {
    const item = images[0]!;
    return (
      <section
        data-nocms-component="facility-gallery"
        className={`relative ${className}`}
        role="figure"
        aria-label={`Photo of ${facilityName}`}
      >
        {heading && (
          <h2
            data-role="heading"
            className="font-heading text-2xl sm:text-3xl font-bold text-text mb-4"
          >
            {heading}
          </h2>
        )}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-text/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={altOf(item, 0)}
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      data-nocms-component="facility-gallery"
      className={className}
      aria-label={`${facilityName} photo gallery — ${images.length} images`}
    >
      {heading && (
        <h2
          data-role="heading"
          className="font-heading text-2xl sm:text-3xl font-bold text-text mb-4"
        >
          {heading}
        </h2>
      )}
      <Carousel aria-label={`${facilityName} photo gallery`}>
        <CarouselContent>
          {images.map((item, idx) => (
            <CarouselItem key={`${item.src}-${idx}`}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-text/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={altOf(item, idx)}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious aria-label="View previous image" />
        <CarouselNext aria-label="View next image" />
      </Carousel>
    </section>
  );
}

export type { FacilityGalleryProps, FacilityGalleryImage };
export default FacilityGallery;
