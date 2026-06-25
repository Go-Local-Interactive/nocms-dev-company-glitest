"use client";

import * as React from "react";
import type { Facility, FacilityHourEntry } from "@/types/Facility";

/**
 * Facility hours block. Source: storage-theme-payload `src/components/FacilityHours`
 * (Layout-1) — collapsed and adapted to the local `Facility.hours[]` shape
 * (one flat list, monday→sunday, isOpen/openTime/closeTime). The original split
 * office/access/call-center hours; we ship a single list and a "Currently
 * open" pill keyed off the visitor's local day-of-week. The pill is
 * client-rendered via a small inlined hook so the SSR pass stays neutral.
 *
 * Editor contract: root tagged `data-nocms-component="facility-hours"`. The
 * heading carries `data-role="heading"`; the pill stays unrolled (it's
 * dynamic) and the rows are plain.
 */

interface FacilityHoursProps {
  hours: Facility["hours"];
  heading?: string;
  className?: string;
  showStatusPill?: boolean;
}

const DAY_LABELS: Record<FacilityHourEntry["day"], string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_ORDER: FacilityHourEntry["day"][] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function formatTime(time: string | null): string {
  if (!time) return "";
  // Accepts "HH:MM" or "H:MM AM/PM"; passes through display-friendly strings.
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;
  let h = Number(match[1]);
  const m = match[2];
  const meridiem = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${meridiem}`;
}

function entryHoursText(entry: FacilityHourEntry): string {
  if (!entry.isOpen) return "Closed";
  if (!entry.openTime || !entry.closeTime) return "Closed";
  return `${formatTime(entry.openTime)} - ${formatTime(entry.closeTime)}`;
}

function useCurrentDay(): FacilityHourEntry["day"] | null {
  const [day, setDay] = React.useState<FacilityHourEntry["day"] | null>(null);
  React.useEffect(() => {
    const idx = new Date().getDay(); // 0 = Sunday
    const map: FacilityHourEntry["day"][] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    setDay(map[idx] ?? null);
  }, []);
  return day;
}

export function FacilityHours({
  hours,
  heading = "Location Hours",
  className = "",
  showStatusPill = true,
}: FacilityHoursProps) {
  const currentDay = useCurrentDay();

  if (!hours || hours.length === 0) {
    return (
      <section
        data-nocms-component="facility-hours"
        className={className}
        aria-label="Facility hours"
      >
        <p className="text-muted">Hours information is not available at this time.</p>
      </section>
    );
  }

  // Sort to the canonical week order; unknown days fall to the end.
  const sorted = [...hours].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day),
  );
  const todayEntry = currentDay ? sorted.find((h) => h.day === currentDay) : null;
  const isOpenNow = todayEntry?.isOpen ?? false;

  return (
    <section
      data-nocms-component="facility-hours"
      className={`flex flex-col gap-4 ${className}`}
      aria-label="Facility hours"
    >
      <div className="flex items-center gap-3">
        <h3
          data-role="heading"
          className="font-heading text-xl font-semibold text-text"
        >
          {heading}
        </h3>
        {showStatusPill && currentDay && (
          <span
            className={
              isOpenNow
                ? "inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"
                : "inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700"
            }
            aria-live="polite"
          >
            {isOpenNow ? "Open now" : "Closed now"}
          </span>
        )}
      </div>
      <ul role="list" className="divide-y divide-text/10">
        {sorted.map((entry) => {
          const isToday = currentDay === entry.day;
          return (
            <li
              key={entry.day}
              className={`flex items-center justify-between py-2 text-sm ${isToday ? "font-semibold text-text" : "text-muted"}`}
            >
              <span className="capitalize">{DAY_LABELS[entry.day] ?? entry.day}</span>
              <span>{entryHoursText(entry)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export type { FacilityHoursProps };
export default FacilityHours;
