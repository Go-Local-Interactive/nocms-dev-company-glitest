import * as React from "react";
import type { LexicalNode, LexicalRoot } from "./types";

/** Minimal Lexical-AST → React renderer. Handles the subset Payload typically
 *  produces: root → paragraph/heading/list/quote, listitem, text (with format
 *  bitmask), link, linebreak. Unknown nodes render their children only. */

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 1 << 1;
const FORMAT_STRIKETHROUGH = 1 << 2;
const FORMAT_UNDERLINE = 1 << 3;
const FORMAT_CODE = 1 << 4;

export function Lexical({
  value,
  className,
  subfield = "body",
}: {
  value?: LexicalRoot | null;
  className?: string;
  /** Payload field name this lexical content is bound to (rendered as
   *  `data-payload-subfield`). The inspector reads it via `closest()` to
   *  know which field a clicked paragraph/heading/etc. belongs to. */
  subfield?: string;
}) {
  if (!value?.root?.children?.length) return null;
  return (
    <div className={className} data-nocms-component="lexical" data-payload-subfield={subfield}>
      {value.root.children.map((child, i) => (
        <RenderNode key={i} node={child} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: LexicalNode }) {
  switch (node.type) {
    case "paragraph":
      return <p>{renderChildren(node)}</p>;
    case "heading": {
      const tag = (node.tag as string) || "h2";
      return React.createElement(tag, {}, renderChildren(node));
    }
    case "list": {
      const tag = node.listType === "number" ? "ol" : "ul";
      return React.createElement(tag, {}, renderChildren(node));
    }
    case "listitem":
      return <li>{renderChildren(node)}</li>;
    case "quote":
      return <blockquote>{renderChildren(node)}</blockquote>;
    case "link": {
      const href = (node.url as string) || (node.fields?.url as string) || "#";
      return <a href={href}>{renderChildren(node)}</a>;
    }
    case "linebreak":
      return <br />;
    case "text":
      return renderText(node);
    default:
      return <>{renderChildren(node)}</>;
  }
}

function renderChildren(node: LexicalNode): React.ReactNode {
  if (!node.children?.length) return null;
  return node.children.map((c, i) => <RenderNode key={i} node={c} />);
}

function renderText(node: LexicalNode): React.ReactNode {
  let el: React.ReactNode = node.text ?? "";
  const fmt = typeof node.format === "number" ? node.format : 0;
  if (fmt & FORMAT_CODE) el = <code>{el}</code>;
  if (fmt & FORMAT_STRIKETHROUGH) el = <s>{el}</s>;
  if (fmt & FORMAT_UNDERLINE) el = <u>{el}</u>;
  if (fmt & FORMAT_ITALIC) el = <em>{el}</em>;
  if (fmt & FORMAT_BOLD) el = <strong>{el}</strong>;
  return el;
}

function nodeToText(n: LexicalNode): string {
  const out: string[] = [];
  const walk = (x: LexicalNode) => {
    if (x.type === "text" && typeof x.text === "string") out.push(x.text);
    x.children?.forEach(walk);
  };
  walk(n);
  return out.join(" ").trim();
}

/** Pull plain text out of lexical — handy for previews / non-rendered uses. */
export function lexicalToText(value?: LexicalRoot | null): string {
  if (!value?.root) return "";
  return nodeToText(value.root);
}

/** Pull the top-level list items as plain strings — useful when the body is a
 *  list and a renderer wants to map each item to a card/step. */
export function lexicalListItems(value?: LexicalRoot | null): string[] {
  if (!value?.root?.children) return [];
  const list = value.root.children.find((c) => c.type === "list");
  if (!list?.children) return [];
  return list.children
    .filter((c) => c.type === "listitem")
    .map(nodeToText);
}

/** Walk the top-level children and pair heading nodes with the next paragraph
 *  node. Used by FAQ-style renderers to fold the lexical AST into
 *  question/answer pairs for accordion display. */
export function lexicalQAPairs(value?: LexicalRoot | null): Array<{ q: string; a: string }> {
  if (!value?.root?.children) return [];
  const pairs: Array<{ q: string; a: string }> = [];
  let pendingQ: string | null = null;
  for (const node of value.root.children) {
    if (node.type === "heading") {
      pendingQ = nodeToText(node);
    } else if (node.type === "paragraph" && pendingQ != null) {
      pairs.push({ q: pendingQ, a: nodeToText(node) });
      pendingQ = null;
    }
  }
  return pairs;
}
