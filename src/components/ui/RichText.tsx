import * as React from "react";

/**
 * Minimal Markdown shim — replaces the upstream Lexical RichText renderer.
 * Source-string mode: parses a small Markdown subset (paragraphs, line breaks,
 * `# / ## / ###` headings, `**bold**`, `_italic_`, and `[text](url)` inline links).
 * Children mode: pass-through for callers who hand-compose richer JSX.
 *
 * Editor contract: root tagged `data-nocms-component="rich-text"` only — the
 * wrapping component owns heading/subheading roles. Empty/undefined source
 * renders nothing.
 */

type RichTextProps =
  | { source?: string; children?: undefined; className?: string }
  | { source?: undefined; children: React.ReactNode; className?: string };

export const RichText: React.FC<RichTextProps> = ({ source, children, className }) => {
  if (children) {
    return (
      <div data-nocms-component="rich-text" className={className}>
        {children}
      </div>
    );
  }
  if (!source || !source.trim()) return null;

  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div data-nocms-component="rich-text" className={className}>
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
};

function renderBlock(block: string, key: number): React.ReactNode {
  const trimmed = block.trim();
  if (!trimmed) return null;
  const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
  if (heading) {
    const level = heading[1]!.length;
    const text = heading[2]!;
    if (level === 1) return <h1 key={key}>{renderInline(text)}</h1>;
    if (level === 2) return <h2 key={key}>{renderInline(text)}</h2>;
    return <h3 key={key}>{renderInline(text)}</h3>;
  }
  const lines = trimmed.split("\n");
  return (
    <p key={key}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {renderInline(line)}
        </React.Fragment>
      ))}
    </p>
  );
}

const TOKEN = /(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string): React.ReactNode {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^_[^_]+_$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) return <a key={i} href={link[2]}>{link[1]}</a>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default RichText;
