import * as React from "react";
import type { PayloadAtomicBlock } from "@/lib/payload";
import { REGISTRY } from "./registry";
import { payloadBlockAttrs } from "@/lib/payload-attrs";

// React Server Components support async renderers — TS still needs the cast.
type AnyComponent = (props: PayloadAtomicBlock) => React.ReactNode;

/** Walks a Payload `blocks[]` array and renders each via the slug-keyed
 *  registry. Each rendered block is wrapped in a div carrying the
 *  `data-payload-*` identity attributes — that's what the nocms inspector
 *  reads when the user clicks on a block in the preview iframe.
 *
 *  Unknown slugs fall through to a noop fallback that logs a dev warning,
 *  so adding a new block in Payload can't break a deployed template. */
export function RenderBlocks({
  blocks,
  docId,
  blocksField = "blocks",
}: {
  blocks: PayloadAtomicBlock[] | null | undefined;
  docId: string;
  blocksField?: string;
}) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block, i) => {
        const renderer = REGISTRY[block.blockType] as AnyComponent | undefined;
        if (!renderer) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[RenderBlocks] no renderer registered for blockType "${block.blockType}"`);
          }
          return null;
        }
        const Component = renderer;
        const attrs = payloadBlockAttrs({
          collection: "pages",
          docId,
          field: blocksField,
          blockId: block.id,
          blockName: block.blockName ?? null,
        });
        return (
          <div key={block.id ?? i} {...attrs} data-nocms-component="render-blocks">
            <Component {...block} />
          </div>
        );
      })}
    </>
  );
}
