import type { PayloadAtomicBlock, LexicalRoot, LexicalNode } from "@/lib/payload";

/** Re-exports so renderers can pull all block-related types from one place. */
export type { PayloadAtomicBlock, LexicalRoot, LexicalNode };

/** Props every block renderer accepts — the atomic block shape itself.
 *  Renderers destructure title, body, media, mediaArray and read only what
 *  they need. The wrapping RenderBlocks dispatcher carries docId / blocksField
 *  on a parent element, so renderers don't need them. */
export type BlockProps = PayloadAtomicBlock;
