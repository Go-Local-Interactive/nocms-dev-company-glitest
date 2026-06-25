/**
 * Normalized unit-group shape — what the v3 nocms proxy returns from
 * GET /api/v3/{fms}/unit-groups?facilityUuid={facilityUuid}.
 *
 * The proxy normalizes per-vendor responses to this common contract; the
 * template stays vendor-agnostic. Some optional fields (sub-promotion details,
 * unitTypeImage) may be omitted by a given vendor — code defensively.
 */

export interface UnitGroupAmenity {
  key: string;
  present: boolean;
}

export interface UnitGroupTypes {
  vehicleRv: boolean;
  selfStorage: boolean;
}

export interface AutoAppliedPromotion {
  promotionUuid: string;
  promotionName: string;
  /** Documented but frequently null in live responses. */
  discountType: string | null;
  /** Same caveat as discountType. */
  discountAmountInPennies: number | null;
}

export interface UnitGroup {
  /** Vendor-native UUID — passed downstream to the reservation endpoint */
  unitGroupUuid: string;
  /** Operator-set short label, e.g. "Premium" */
  description: string;
  unitGroupDepth: number;
  unitGroupWidth: number;
  unitGroupHeight?: number;
  amenities?: UnitGroupAmenity[];
  types?: UnitGroupTypes;
  /** Rentable-now count. Zero → hidden / disabled per ux-rules. */
  availableUnitCount: number;
  /** Total in the group (rented + available). For scarcity copy only. */
  unitCount?: number;
  facilityName?: string;
  facilityAddress?: string;
  /** Undiscounted rate; show struck-through when > currentWebRate */
  currentStreetRate?: number;
  /** Online rate. Primary price on the card. */
  currentWebRate: number;
  unitType: string;
  unitTypeImage?: string | null;
  bestAutoAppliedPromotion?: AutoAppliedPromotion | null;
}

export interface UnitGroupsResponse {
  data: { unitGroups: UnitGroup[] };
}
