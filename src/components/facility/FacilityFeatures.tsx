import * as React from "react";
import {
  Snowflake,
  ShieldCheck,
  Camera,
  KeyRound,
  Truck,
  Lightbulb,
  Wifi,
  CreditCard,
  Box,
  Building,
  Lock,
  Star,
} from "lucide-react";
import { RichText } from "@/components/ui/RichText";

/**
 * Facility features grid. Source: storage-theme-payload `src/components/FacilityFeatures`
 * (Layout-1 only) — strips the Payload `FacilityFeature` type and the Lexical
 * RichText. Accepts a plain `{ name, icon? }[]` and an optional Markdown
 * `content` body for the heading/description.
 *
 * Editor contract: root tagged `data-nocms-component="facility-features"`.
 * The first feature name acts as the heading leaf; description rides RichText.
 */

type IconKey =
  | "climate"
  | "security"
  | "camera"
  | "access"
  | "moving"
  | "lighting"
  | "wifi"
  | "payment"
  | "box"
  | "office"
  | "lock"
  | "star";

const ICON_MAP: Record<IconKey, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  climate: Snowflake,
  security: ShieldCheck,
  camera: Camera,
  access: KeyRound,
  moving: Truck,
  lighting: Lightbulb,
  wifi: Wifi,
  payment: CreditCard,
  box: Box,
  office: Building,
  lock: Lock,
  star: Star,
};

export interface FacilityFeatureItem {
  name: string;
  icon?: IconKey;
}

interface FacilityFeaturesProps {
  features: FacilityFeatureItem[];
  /** Optional Markdown header copy (heading + description). */
  content?: string;
  className?: string;
}

export function FacilityFeatures({
  features,
  content,
  className = "",
}: FacilityFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <div
      data-nocms-component="facility-features"
      className={`facility-features-wrapper ${className}`}
    >
      {content && (
        <div className="mb-8 text-center">
          <RichText source={content} />
        </div>
      )}
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon ? ICON_MAP[feature.icon] : Star;
          return (
            <li
              key={`${feature.name}-${idx}`}
              className="flex flex-col items-center rounded-lg border border-text/10 bg-background p-6 text-center shadow-sm"
            >
              <div className="mb-3 text-primary">
                <Icon className="h-10 w-10" aria-hidden={true} />
              </div>
              <div
                {...(idx === 0 ? { "data-role": "heading" } : {})}
                className="font-heading text-base font-semibold text-text"
              >
                {feature.name}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export type { FacilityFeaturesProps };
export default FacilityFeatures;
