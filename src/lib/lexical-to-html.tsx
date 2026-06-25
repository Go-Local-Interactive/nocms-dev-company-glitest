/**
 * Minimal renderer for Payload's Lexical richText JSON. Handles the common
 * cases (headings, paragraphs, lists, links, formatting flags). Anything
 * exotic (custom blocks, uploads inside richText) falls through to plain text.
 */

import * as React from "react";
import type { LexicalNode, LexicalRoot } from "./payload";

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 1 << 1;
const FORMAT_UNDERLINE = 1 << 3;
const FORMAT_CODE = 1 << 4;

function applyFormat(text: string, format: number | string | undefined): React.ReactNode {
  let node: React.ReactNode = text;
  const f = typeof format === "number" ? format : 0;
  if (f & FORMAT_CODE) node = <code>{node}</code>;
  if (f & FORMAT_UNDERLINE) node = <u>{node}</u>;
  if (f & FORMAT_ITALIC) node = <em>{node}</em>;
  if (f & FORMAT_BOLD) node = <strong>{node}</strong>;
  return node;
}

function renderNode(node: LexicalNode, key: string): React.ReactNode {
  if (node.type === "text") {
    return <React.Fragment key={key}>{applyFormat(node.text ?? "", node.format)}</React.Fragment>;
  }
  const children = (node.children ?? []).map((c, i) => renderNode(c, `${key}.${i}`));
  switch (node.type) {
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const Tag = (node.tag ?? "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return <Tag key={key}>{children}</Tag>;
    }
    case "list":
      return node.tag === "ol" ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>;
    case "listitem":
      return <li key={key}>{children}</li>;
    case "quote":
      return <blockquote key={key}>{children}</blockquote>;
    case "link": {
      const url = node.fields?.url ?? node.url ?? "#";
      const newTab = node.fields?.newTab;
      return (
        <a key={key} href={url} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    }
    case "linebreak":
      return <br key={key} />;
    default:
      return <React.Fragment key={key}>{children}</React.Fragment>;
  }
}

export function LexicalRichText({ value, className }: { value: LexicalRoot | undefined | null; className?: string }) {
  if (!value?.root?.children?.length) return null;
  return (
    <div className={className}>
      {value.root.children.map((child, i) => renderNode(child, String(i)))}
    </div>
  );
}
