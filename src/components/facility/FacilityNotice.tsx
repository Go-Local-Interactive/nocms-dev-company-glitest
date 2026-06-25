import * as React from "react";
import { RichText } from "@/components/ui/RichText";

/**
 * Facility notice. Source: storage-theme-payload `src/components/FacilityNotice`
 * (Layout-1) — rounded callout card for time-sensitive announcements (holiday
 * hours, gate maintenance, promotions). Strips the Payload `Facility` type and
 * the Lexical RichText body in favor of a plain Markdown `notice` string.
 *
 * Editor contract: root tagged `data-nocms-component="facility-notice"`. The
 * facility name is the heading leaf; the body rides the RichText shim.
 */

type NoticeColor = "primary-light" | "warning" | "info" | "neutral";

interface FacilityNoticeProps {
  /** Facility display name; used in the screen-reader heading. */
  facilityName: string;
  /** Markdown body. If empty/undefined, the component renders nothing. */
  notice?: string | null;
  color?: NoticeColor;
  className?: string;
}

const COLOR_CLASSES: Record<NoticeColor, string> = {
  "primary-light": "bg-primary/10 text-text border-primary/30",
  warning: "bg-amber-50 text-amber-900 border-amber-300",
  info: "bg-sky-50 text-sky-900 border-sky-300",
  neutral: "bg-zinc-50 text-zinc-900 border-zinc-300",
};

export function FacilityNotice({
  facilityName,
  notice,
  color = "primary-light",
  className = "",
}: FacilityNoticeProps) {
  if (!notice || !notice.trim()) return null;

  return (
    <section
      data-nocms-component="facility-notice"
      className={`mx-auto max-w-[460px] rounded-xl border px-6 py-5 text-center ${COLOR_CLASSES[color]} ${className}`}
      role="region"
      aria-roledescription="Facility Notice"
      aria-live="polite"
    >
      <h3 data-role="heading" className="sr-only">
        Important Notice for {facilityName}
      </h3>
      <RichText source={notice} />
    </section>
  );
}

export type { FacilityNoticeProps };
export default FacilityNotice;
