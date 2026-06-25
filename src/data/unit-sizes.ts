/**
 * Reference content for the size guide / sizes landing page. Static — these
 * are descriptive aids, not live FMS data. The actual rentable inventory comes
 * from the runtime `unit-groups` endpoint (see `src/lib/api/getUnitGroups.ts`).
 */

export interface UnitSize {
  /** Stable id used for tab keys / anchor links */
  id: string;
  /** Display name, e.g. "5x10" */
  name: string;
  /** Width in feet */
  width: number;
  /** Depth in feet */
  depth: number;
  /** Square footage */
  sqft: number;
  /** "Closet" / "Walk-in closet" / etc — short comparison */
  comparison: string;
  /** One-sentence summary used on cards */
  description: string;
  /** Longer paragraph for the size guide */
  longDescription: string;
  /** Bullet list of representative items that fit */
  itemsThatFit: string[];
  /** Indicative starting monthly price (USD) — display copy only */
  startingPrice?: number;
  /** Optional reference image URL */
  imageSrc?: string;
}

export const unitSizes: UnitSize[] = [
  {
    id: "5x5",
    name: "5x5",
    width: 5,
    depth: 5,
    sqft: 25,
    comparison: "Hall closet",
    description: "Closet-sized. Great for boxes, seasonal decor, and a few small items.",
    longDescription:
      "A 5x5 unit is the smallest size we offer — roughly the footprint of a standard hall closet. Stacks of medium boxes, holiday decor, off-season clothing, a small chair or tower of plastic bins all fit comfortably. Most customers can clear out a single closet or a couple of dorm-sized loads.",
    itemsThatFit: [
      "10–15 medium boxes",
      "Seasonal decorations",
      "Off-season clothing",
      "Small chair or single chest of drawers",
      "Sports equipment and gear",
    ],
    startingPrice: 39,
    imageSrc:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c8?w=1200&q=80",
  },
  {
    id: "5x10",
    name: "5x10",
    width: 5,
    depth: 10,
    sqft: 50,
    comparison: "Walk-in closet",
    description: "Holds a small one-bedroom apartment minus large appliances.",
    longDescription:
      "A 5x10 fits the contents of a walk-in closet or a small one-bedroom apartment without major appliances. Mattress sets stand on their long edge against the back wall, leaving room for a dresser, a desk, and 15–20 boxes. A common pick for college students and downsizers.",
    itemsThatFit: [
      "Queen mattress and box spring",
      "Small dresser and desk",
      "15–20 medium boxes",
      "Bicycle and small appliances",
      "Contents of a small one-bedroom",
    ],
    startingPrice: 65,
    imageSrc:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  },
  {
    id: "10x10",
    name: "10x10",
    width: 10,
    depth: 10,
    sqft: 100,
    comparison: "Single-car garage (half)",
    description: "Our most popular size. Fits a one-bedroom apartment with appliances.",
    longDescription:
      "A 10x10 is the most-rented size in self-storage and for good reason — it holds a complete one-bedroom apartment with appliances or the major furniture from a two-bedroom. Refrigerator, washer, dryer, sofa, mattress set, dining set, and 25–30 boxes all fit with a center aisle.",
    itemsThatFit: [
      "Full one-bedroom apartment",
      "Major appliances (refrigerator, washer, dryer)",
      "Living room furniture set",
      "Mattress sets and bedroom dresser",
      "25–30 boxes",
    ],
    startingPrice: 119,
    imageSrc:
      "https://images.unsplash.com/photo-1594819047050-99defe213a55?w=1200&q=80",
  },
  {
    id: "10x20",
    name: "10x20",
    width: 10,
    depth: 20,
    sqft: 200,
    comparison: "Single-car garage",
    description: "Holds a three-bedroom house or business inventory.",
    longDescription:
      "A 10x20 is the right size for the contents of a three-bedroom house, including all major appliances and large furniture. It's also the typical sweet spot for small business inventory — pallets, packing stations, retail overflow. Drive-up units at this size make loading and unloading much faster.",
    itemsThatFit: [
      "Three-bedroom house contents",
      "Multiple bedroom sets",
      "Major appliances and dining sets",
      "Pallets of business inventory",
      "Compact car (in vehicle units)",
    ],
    startingPrice: 199,
    imageSrc:
      "https://images.unsplash.com/photo-1600566753086-00f18fe6ba68?w=1200&q=80",
  },
  {
    id: "10x30",
    name: "10x30",
    width: 10,
    depth: 30,
    sqft: 300,
    comparison: "Two-car garage",
    description: "Holds a five-bedroom house with room for vehicles or RVs.",
    longDescription:
      "A 10x30 is the largest standard storage unit we offer — equivalent to a generous two-car garage. It holds the full contents of a five-bedroom house with appliances and still has space for large items like a boat, motorcycle, classic car, or substantial business inventory.",
    itemsThatFit: [
      "Five-bedroom house contents",
      "Boat or jet ski on trailer",
      "Motorcycle or classic car",
      "Large-scale business inventory",
      "Multiple appliance sets",
    ],
    startingPrice: 279,
    imageSrc:
      "https://images.unsplash.com/photo-1597007030739-6d2e7172ee6c?w=1200&q=80",
  },
];
