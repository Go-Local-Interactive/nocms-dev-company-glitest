import * as React from "react";
import Image from "next/image";

/**
 * Gallery image grid. Source: storage-theme-payload `src/blocks/GalleryBlock`
 * — minus Vimeo video, focal-point, and Payload size lookups. Accepts a flat
 * list of images; the column count adapts to the count.
 *
 * Editor contract: tagged `data-nocms-component="gallery-block"`. No text
 * roles — every image is equal-weight, so we don't tag a primary one.
 */

export interface GalleryImage {
  src: string;
  alt?: string;
}

interface GalleryBlockProps {
  images?: GalleryImage[];
  heading?: string;
}

const defaultImages: GalleryImage[] = [
  { src: "/og-image.svg", alt: "Storage facility exterior" },
  { src: "/og-image.svg", alt: "Climate-controlled corridor" },
  { src: "/og-image.svg", alt: "Drive-up units" },
  { src: "/og-image.svg", alt: "Secure entry gate" },
];

export function GalleryBlock({
  images = defaultImages,
  heading,
}: GalleryBlockProps) {
  if (!images.length) return null;
  const count = images.length;
  const colClass =
    count === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : count === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-4";

  return (
    <section
      data-nocms-component="gallery-block"
      className="py-12 lg:py-16"
      aria-label={`Gallery with ${count} ${count === 1 ? "image" : "images"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2
            data-role="heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-text mb-8 text-center"
          >
            {heading}
          </h2>
        )}
        <ul className={`grid ${colClass} gap-3 lg:gap-4`}>
          {images.map((img, i) => (
            <li
              key={`${img.src}-${i}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface"
            >
              <Image
                src={img.src}
                alt={img.alt ?? `Gallery image ${i + 1} of ${count}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
