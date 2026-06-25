/**
 * Helpers that attach the data-payload-* identity attributes the nocms
 * inspector reads when the user clicks a rendered element in the preview
 * iframe. Match by `data-payload-doc-id` first, then by
 * `data-payload-block-id` for blocks-array entries. `data-payload-field` is
 * optional — it pre-focuses the editor on a specific field.
 *
 * Names live in one place so the contract with the inspector can't drift.
 */

export type CmsCollection =
  | "pages"
  | "posts"
  | "locations"
  | "brands"
  | "categories"
  | "media"
  | "emails";

interface DocAttrs {
  collection: CmsCollection;
  docId: string | number | undefined;
}

interface FieldAttrs extends DocAttrs {
  field: string;
}

interface BlockAttrs extends FieldAttrs {
  /** Stable per-instance id Payload assigns to every blocks-array entry. */
  blockId: string | number | undefined;
  /** Human-set label for the block (optional, used in the editor header). */
  blockName?: string | null;
}

/** Attrs identifying the doc only. Spread on any wrapper rendering a doc. */
export function payloadDocAttrs({ collection, docId }: DocAttrs): Record<string, string> {
  if (docId == null) return {};
  return {
    "data-payload-collection": collection,
    "data-payload-doc-id": String(docId),
  };
}

/** Attrs targeting a single field on a doc. Inspector opens an inline editor
 *  scoped to that field. */
export function payloadFieldAttrs({ collection, docId, field }: FieldAttrs): Record<string, string> {
  return {
    ...payloadDocAttrs({ collection, docId }),
    "data-payload-field": field,
  };
}

/** Attrs targeting a single sub-field on a block inside a blocks-array. */
export function payloadBlockAttrs({
  collection,
  docId,
  field,
  blockId,
  blockName,
}: BlockAttrs): Record<string, string> {
  if (blockId == null) return payloadFieldAttrs({ collection, docId, field });
  const out: Record<string, string> = {
    ...payloadFieldAttrs({ collection, docId, field }),
    "data-payload-block-id": String(blockId),
  };
  if (blockName) out["data-payload-block-name"] = blockName;
  return out;
}
