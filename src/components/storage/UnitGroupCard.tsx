import Link from "next/link";
import type { UnitGroup } from "@/types/UnitGroup";

/**
 * One card per unit group. Pure presentation — derives display from the
 * normalized v3 shape. UX rules (hide sold-out, scarcity, promo emphasis) are
 * applied by the parent grid; this component just renders.
 *
 * Per the monument-unit-groups skill's card-mapping reference:
 *   - title: depth × width
 *   - subtitle: unitType — description
 *   - primary price: currentWebRate
 *   - strike price: currentStreetRate when > currentWebRate
 *   - promo badge: bestAutoAppliedPromotion.promotionName
 *   - scarcity hint: only when 0 < availableUnitCount <= 3
 *   - amenity chips: max 3 present:true entries
 */

interface UnitGroupCardProps {
  group: UnitGroup;
  /** Where clicking the card should go — built by the parent so multi-facility
   * sites can route via /{locationSlug}/reserve/{unitGroupUuid}. */
  reserveHref: string;
}

const formatRate = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function UnitGroupCard({ group, reserveHref }: UnitGroupCardProps) {
  const showStrike =
    typeof group.currentStreetRate === "number" && group.currentStreetRate > group.currentWebRate;
  const promo = group.bestAutoAppliedPromotion ?? null;
  const scarcity = group.availableUnitCount > 0 && group.availableUnitCount <= 3;
  const amenityChips = (group.amenities ?? [])
    .filter((a) => a.present)
    .slice(0, 3)
    .map((a) => a.key);

  return (
    <article data-nocms-component="unit-group-card" className="rounded-xl border border-zinc-200 p-6 shadow-sm">
      {promo && (
        <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
          {promo.promotionName}
        </span>
      )}
      <h3 className="text-2xl font-semibold tracking-tight" data-role="heading">
        {group.unitGroupDepth} × {group.unitGroupWidth}
      </h3>
      <p className="mt-1 text-sm text-zinc-600" data-role="text">
        {group.unitType} — {group.description}
      </p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{formatRate(group.currentWebRate)}</span>
        <span className="text-sm text-zinc-500" data-role="text-2">/ mo</span>
        {showStrike && (
          <span className="text-sm text-zinc-400 line-through">
            {formatRate(group.currentStreetRate as number)}
          </span>
        )}
      </div>
      {scarcity && (
        <p className="mt-2 text-sm font-medium text-amber-700" data-role="text-3">
          Only {group.availableUnitCount} left!
        </p>
      )}
      {amenityChips.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {amenityChips.map((chip) => (
            <li key={chip} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
              {chip}
            </li>
          ))}
        </ul>
      )}
      <Link
        href={reserveHref}
        className="mt-5 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:outline-none"
      >
        Reserve this size
      </Link>
    </article>
  );
}
