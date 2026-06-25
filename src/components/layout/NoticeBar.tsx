"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DISMISS_KEY = "nocms-notice-dismissed";

// Stable hash of the notice text — dismissal is keyed by it so a CHANGED notice
// re-appears even after a prior one was dismissed.
function noticeKey(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

/**
 * Full-width dismissible alert bar below the header — the legacy
 * `SiteWideNotice`. Blue band, centered text, close button on the right.
 * Renders nothing when there's no notice text or after dismissal. Dismissal
 * persists in localStorage (keyed by the notice text) so it survives reloads.
 */
export function NoticeBar({ notice }: { notice?: string | null }) {
  // Start visible (SSR-safe — no localStorage on the server); hide on the client
  // if this exact notice was already dismissed. The brief flash on a previously
  // dismissed bar is the standard trade-off for avoiding a hydration mismatch.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!notice) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === noticeKey(notice)) setVisible(false);
    } catch {
      /* storage unavailable → keep the bar visible */
    }
  }, [notice]);

  if (!notice || !visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, noticeKey(notice));
    } catch {
      /* storage unavailable → dismissal just won't persist */
    }
  };

  // Matches legacy `.site-wide-notice`: bg-primary, py-2 px-4, 16px white text
  // centered in the content column, dismiss button in a narrow right column
  // (legacy grid-cols-[auto_5%]).
  return (
    <div data-nocms-component="notice" className="bg-primary text-white py-2 px-4 text-base">
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <p className="m-0 text-center">{notice}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notice"
          className="p-1 text-white hover:text-white/80 transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
