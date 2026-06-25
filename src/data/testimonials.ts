export interface Testimonial {
  quote: string;
  author: string;
  relationship?: string;
  rating?: number;
  image?: string;
  /** Optional storage-context label, e.g. "Personal Storage", "Business Storage". */
  customerType?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Found a 10x10 climate-controlled unit, reserved it online in five minutes, and was unloading the truck the same afternoon. Gate access has been flawless and the facility is spotless.",
    author: "Sarah Mitchell",
    relationship: "Personal Storage Customer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    customerType: "personal",
  },
  {
    quote:
      "We run an Etsy business out of two 10x20 units — pallets of inventory, packing stations, the works. Cheaper than warehouse space, month-to-month, and we can scale up or down as orders shift.",
    author: "Robert Chen",
    relationship: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    customerType: "business",
  },
  {
    quote:
      "Stored Mom's furniture for almost two years while we sorted out the estate. When we finally opened the unit, everything came out exactly the way it went in. Climate control was worth every penny.",
    author: "Jennifer Park",
    relationship: "Long-term Personal Storage",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    customerType: "personal",
  },
  {
    quote:
      "I park the RV here every winter — open lot, gated, never worried about it for a second. Reasonable rate and the manager texts me if anything looks off. Couldn't ask for more.",
    author: "Margaret Torres",
    relationship: "Vehicle Storage Customer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    rating: 5,
    customerType: "vehicle",
  },
  {
    quote:
      "Renovating our house and needed somewhere to put the entire dining room and living room for three months. The staff helped us pick a 10x15 that fit everything with room to spare.",
    author: "Linda Kowalski",
    relationship: "Personal Storage Customer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    rating: 5,
    customerType: "personal",
  },
];
