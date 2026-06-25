import * as React from "react";
import {
  Calendar,
  ClipboardList,
  CreditCard,
  KeySquare,
  PackageOpen,
  Search,
  Truck,
  type LucideIcon,
} from "lucide-react";

/**
 * Numbered "how to rent" steps. Source: storage-theme-payload
 * `src/blocks/RentalSteps`. The FontAwesome `IconProp` registry is replaced
 * with a small lucide-react map keyed by `icon` string.
 *
 * Editor contract: section heading carries `data-role="heading"`.
 * Per-step text is a body-copy leaf — no role.
 */

export type RentalStepIconKey =
  | "search"
  | "calendar"
  | "card"
  | "key"
  | "truck"
  | "boxes"
  | "checklist";

const iconRegistry: Record<RentalStepIconKey, LucideIcon> = {
  search: Search,
  calendar: Calendar,
  card: CreditCard,
  key: KeySquare,
  truck: Truck,
  boxes: PackageOpen,
  checklist: ClipboardList,
};

export interface RentalStep {
  icon?: RentalStepIconKey;
  text: string;
}

interface RentalStepsProps {
  heading?: string;
  steps?: RentalStep[];
}

const defaultSteps: RentalStep[] = [
  { icon: "search", text: "Find a location near you." },
  { icon: "calendar", text: "Pick the unit size that fits your needs." },
  { icon: "card", text: "Reserve online in under 2 minutes." },
  { icon: "key", text: "Move in on your schedule." },
];

export function RentalSteps({
  heading = "How it works",
  steps = defaultSteps,
}: RentalStepsProps) {
  return (
    <section
      data-nocms-component="rental-steps-flat"
      aria-labelledby="rental-steps-heading"
      className="py-16 lg:py-20 bg-white"
    >
      <h2
        id="rental-steps-heading"
        data-role="heading"
        className="font-heading text-3xl sm:text-4xl font-bold text-text text-center mb-12"
      >
        {heading}
      </h2>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ol
          aria-label="Rental process steps"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, idx) => {
            const Icon = iconRegistry[step.icon ?? "search"];
            const stepNumber = idx + 1;
            return (
              <li key={idx} className="relative">
                <article className="rounded-xl bg-bg p-6 text-center h-full flex flex-col items-center">
                  <div
                    aria-hidden="true"
                    className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-500 mb-2" data-role="text">
                    Step {stepNumber}
                  </p>
                  <p className="text-text font-medium">{step.text}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
