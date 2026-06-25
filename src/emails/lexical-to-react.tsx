import type { CSSProperties, ReactNode } from "react";
import { Text } from "@react-email/components";

/** Minimal lexical→React renderer for email bodies. Covers the shapes
 *  produced by the cms-actions helpers (lexicalParagraph, lexicalList,
 *  lexicalQA) plus inline bold/italic text formatting.
 *
 *  Why minimal: emails don't need the full lexical surface (no embeds,
 *  no media-in-body, no headings inside lists). If a richer richText
 *  pattern lands in seeds later, extend the switch — don't reach for a
 *  generic AST walker. */

interface LexicalRoot {
  root?: { children?: LexicalNode[] };
}

interface LexicalNode {
  type?: string;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  listType?: "bullet" | "number";
  tag?: string;
  detail?: number;
  mode?: string;
}

interface RenderOptions {
  textStyle?: CSSProperties;
  listStyle?: CSSProperties;
  textKey?: string;
}

const TEXT_BOLD = 1;
const TEXT_ITALIC = 1 << 1;
const TEXT_UNDERLINE = 1 << 3;

function inlineNode(node: LexicalNode, key: number): ReactNode {
  if (node.type === "text") {
    let content: ReactNode = node.text ?? "";
    const format = typeof node.format === "number" ? node.format : 0;
    if (format & TEXT_BOLD) content = <strong key={`b-${key}`}>{content}</strong>;
    if (format & TEXT_ITALIC) content = <em key={`i-${key}`}>{content}</em>;
    if (format & TEXT_UNDERLINE) content = <u key={`u-${key}`}>{content}</u>;
    return <span key={key}>{content}</span>;
  }
  return null;
}

function renderInlines(children: LexicalNode[] | undefined): ReactNode[] {
  return (children ?? []).map((c, i) => inlineNode(c, i)).filter(Boolean);
}

export function LexicalToReact({
  doc,
  options,
}: {
  doc: unknown;
  options?: RenderOptions;
}): ReactNode {
  const root = (doc as LexicalRoot)?.root;
  if (!root?.children?.length) return null;

  return (
    <>
      {root.children.map((node, i) => {
        const key = `lex-${i}`;
        if (node.type === "paragraph") {
          const inlines = renderInlines(node.children);
          if (inlines.length === 0) return null;
          return (
            <Text key={key} style={options?.textStyle}>
              {inlines}
            </Text>
          );
        }
        if (node.type === "heading") {
          const Tag = (node.tag as "h1" | "h2" | "h3" | "h4") || "h3";
          return (
            <Tag key={key} style={{ margin: "16px 0 8px", ...(options?.textStyle ?? {}) }}>
              {renderInlines(node.children)}
            </Tag>
          );
        }
        if (node.type === "list") {
          const ListTag = node.listType === "number" ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              style={{
                margin: "12px 0",
                paddingLeft: 24,
                ...(options?.listStyle ?? {}),
                ...(options?.textStyle ?? {}),
              }}
            >
              {(node.children ?? []).map((item, j) => (
                <li key={`${key}-${j}`} style={{ marginBottom: 6 }}>
                  {renderInlines(item.children)}
                </li>
              ))}
            </ListTag>
          );
        }
        return null;
      })}
    </>
  );
}

/** Flatten a lexical doc to plain text — used by email-button to pull a
 *  URL out of the body field (the body atom doubles as the href slot). */
export function lexicalToPlainText(doc: unknown): string {
  const root = (doc as LexicalRoot)?.root;
  if (!root?.children?.length) return "";
  const walk = (nodes: LexicalNode[]): string =>
    nodes
      .map((n) => {
        if (n.type === "text") return n.text ?? "";
        if (n.children) return walk(n.children);
        return "";
      })
      .join("");
  return walk(root.children).trim();
}
