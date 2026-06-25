export interface Photo {
  src: string;
  alt: string;
  label?: string;
}

interface PhotoGridProps {
  photos?: Photo[];
  layout?: "masonry" | "grid";
  heading?: string;
}

const defaultPhotos: Photo[] = [
  { src: "https://images.unsplash.com/photo-1559234938-b60fff04894d?w=600&q=80", alt: "Community garden", label: "Garden & Grounds" },
  { src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80", alt: "Dining room", label: "Fine Dining" },
  { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80", alt: "Fitness center", label: "Wellness Center" },
  { src: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=600&q=80", alt: "Common area lounge", label: "Common Areas" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", alt: "Private apartment", label: "Private Suites" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", alt: "Community exterior", label: "Exterior" },
];

export function PhotoGrid({
  photos = defaultPhotos,
  layout = "grid",
  heading = "Life Inside Our Community",
}: PhotoGridProps) {
  if (layout === "masonry") {
    return (
      <section data-nocms-component="photo-grid" className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {heading && (
            <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12">
              {heading}
            </h2>
          )}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {(photos ?? []).map((photo, i) => (
              <div
                key={photo.src}
                className="relative group break-inside-avoid overflow-hidden rounded-lg"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    i % 3 === 0 ? "h-80" : i % 3 === 1 ? "h-60" : "h-72"
                  }`}
                  loading="lazy" data-role="media"
                />
                {photo.label && (
                  <div className="absolute inset-0 bg-gradient-to-t from-text/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-semibold text-sm">{photo.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* grid layout (default) */
  return (
    <section data-nocms-component="photo-grid" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 data-role="heading" className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(photos ?? []).map((photo) => (
            <div
              key={photo.src}
              className="relative group overflow-hidden rounded-lg aspect-[4/3]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {photo.label && (
                <div className="absolute inset-0 bg-gradient-to-t from-text/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-semibold text-sm">{photo.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
