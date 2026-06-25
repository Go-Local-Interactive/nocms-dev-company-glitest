import * as React from "react";

/** Visual divider — a thin horizontal rule with section padding. */
export function DividerBlock() {
  return (
    <div data-nocms-component="divider" className="py-12 px-6 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <hr className="border-t border-text/10" />
      </div>
    </div>
  );
}
