import * as React from "react";

/**
 * DateBadge — square calendar-style date pill. Source: storage-theme-payload
 * `src/components/DateBadge`. Replaces the cva variant helper with a small
 * inline switch. Used by blog cards and facility-event tiles.
 *
 * Editor contract: root tagged `data-nocms-component="date-badge"`. Day +
 * month are dynamic so neither carries a `data-role`.
 */

interface DateBadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Day of the month, e.g. "06". */
  day: string | number;
  /** Month abbreviation, e.g. "Nov". */
  month: string;
  variant?: "default" | "primary";
}

export function DateBadge({
  day,
  month,
  variant = "primary",
  className = "",
  ...rest
}: DateBadgeProps) {
  const variantClass =
    variant === "primary"
      ? "bg-primary text-white"
      : "bg-background text-text border border-text/10";
  return (
    <div
      data-nocms-component="date-badge"
      className={`flex h-16 w-16 flex-col items-center justify-center rounded-md text-center shadow-sm ${variantClass} ${className}`}
      role="img"
      aria-label={`${month} ${day}`}
      {...rest}
    >
      <div className="font-heading text-2xl font-bold leading-none">{day}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
        {month}
      </div>
    </div>
  );
}

export type { DateBadgeProps };
export default DateBadge;
