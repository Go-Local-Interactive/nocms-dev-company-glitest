import * as React from "react";

/**
 * Horizontal rule — small visual divider. Source: storage-theme-payload
 * `src/blocks/HorizontalRule`. Drops the Payload `blockType` field; keeps the
 * `enableGutter` prop so it can match its siblings' container width.
 *
 * Editor contract: `data-nocms-component` only — purely decorative.
 */
interface HorizontalRuleProps {
  enableGutter?: boolean;
  className?: string;
}

export function HorizontalRule({
  enableGutter = true,
  className = "",
}: HorizontalRuleProps) {
  return (
    <div
      data-nocms-component="horizontal-rule"
      className={enableGutter ? "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" : ""}
    >
      <hr className={`border-0 border-t border-zinc-200 my-6 ${className}`} />
    </div>
  );
}
