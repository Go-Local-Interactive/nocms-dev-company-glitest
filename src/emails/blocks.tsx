import type { CSSProperties } from "react";
import { Button, Hr, Img, Section, Text } from "@react-email/components";
import { LexicalToReact, lexicalToPlainText } from "./lexical-to-react";
import type { EmailTheme } from "./theme";

/** React Email renderers — one per slug in `email-blocks.ts`. Slug → component
 *  is the only mapping the renderer needs; adding a new email block = add
 *  a row to `EMAIL_BLOCKS` (in payload/blocks/email-blocks.ts) + a renderer here.
 *
 *  Data attributes follow the inspector contract
 *  (src/lib/inspector/selection-target.ts:108-112): `data-payload-block-id`
 *  + `data-payload-block-name` on the block root, `data-payload-field` on
 *  each editable child. Today the email preview doesn't ship the inspector
 *  overlay yet, but emitting these now means future click-to-edit lands
 *  without a component rewrite. */

interface MediaRef {
  url?: string | null;
  alt?: string | null;
}

interface EmailBlock {
  id?: string;
  blockType?: string;
  blockName?: string;
  title?: string;
  body?: unknown;
  media?: MediaRef | string | null;
}

interface BlockProps {
  block: EmailBlock;
  theme: EmailTheme;
}

const blockData = (block: EmailBlock) => ({
  "data-payload-block-id": block.id,
  "data-payload-block-name": block.blockType,
});

const mediaUrl = (m: EmailBlock["media"]): string | undefined => {
  if (!m) return undefined;
  if (typeof m === "string") return m;
  return m.url ?? undefined;
};

const mediaAlt = (m: EmailBlock["media"]): string => {
  if (!m || typeof m === "string") return "";
  return m.alt ?? "";
};

const sectionStyle: CSSProperties = { padding: "8px 24px" };

// ── email-header ──────────────────────────────────────────────────────────

export function EmailHeader({ block, theme }: BlockProps) {
  const logo = mediaUrl(block.media) ?? theme.logoUrl;
  const alt = mediaAlt(block.media) || theme.logoAlt || theme.brandName;
  return (
    <Section {...blockData(block)} style={{ ...sectionStyle, paddingTop: 24, paddingBottom: 16, textAlign: "center" }}>
      {logo ? (
        <Img src={logo} alt={alt} width="140" data-payload-field="media" style={{ margin: "0 auto" }} />
      ) : (
        <Text
          data-payload-field="title"
          style={{
            fontFamily: theme.headingFont,
            color: theme.primaryColor,
            fontSize: 20,
            fontWeight: 600,
            margin: 0,
          }}
        >
          {block.title}
        </Text>
      )}
    </Section>
  );
}

// ── email-hero ────────────────────────────────────────────────────────────

export function EmailHero({ block, theme }: BlockProps) {
  const img = mediaUrl(block.media);
  return (
    <Section {...blockData(block)} style={{ ...sectionStyle, paddingTop: 8, paddingBottom: 24 }}>
      {img && (
        <Img
          src={img}
          alt={mediaAlt(block.media)}
          width="552"
          data-payload-field="media"
          style={{ width: "100%", maxWidth: 552, borderRadius: 8, marginBottom: 16 }}
        />
      )}
      {block.title && (
        <Text
          data-payload-field="title"
          style={{
            fontFamily: theme.headingFont,
            color: theme.primaryColor,
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.25,
            margin: "0 0 12px",
          }}
        >
          {block.title}
        </Text>
      )}
      <div data-payload-field="body">
        <LexicalToReact
          doc={block.body}
          options={{
            textStyle: {
              fontFamily: theme.bodyFont,
              color: theme.textColor,
              fontSize: 16,
              lineHeight: 1.55,
              margin: "0 0 12px",
            },
          }}
        />
      </div>
    </Section>
  );
}

// ── email-text ────────────────────────────────────────────────────────────

export function EmailText({ block, theme }: BlockProps) {
  return (
    <Section {...blockData(block)} style={sectionStyle}>
      <div data-payload-field="body">
        <LexicalToReact
          doc={block.body}
          options={{
            textStyle: {
              fontFamily: theme.bodyFont,
              color: theme.textColor,
              fontSize: 16,
              lineHeight: 1.55,
              margin: "0 0 12px",
            },
          }}
        />
      </div>
    </Section>
  );
}

// ── email-button ──────────────────────────────────────────────────────────

export function EmailButton({ block, theme }: BlockProps) {
  const href = lexicalToPlainText(block.body) || "#";
  // The `body` field holds the href; wrapping the Button in a node tagged
  // `data-payload-field="body"` makes the URL slot addressable by the future
  // click-to-edit inspector — sibling to `title` on the Button itself.
  return (
    <Section {...blockData(block)} style={{ ...sectionStyle, paddingTop: 16, paddingBottom: 16, textAlign: "center" }}>
      <div data-payload-field="body">
        <Button
          href={href}
          data-payload-field="title"
          style={{
            backgroundColor: theme.primaryColor,
            color: "#ffffff",
            fontFamily: theme.bodyFont,
            fontSize: 15,
            fontWeight: 600,
            padding: "12px 24px",
            borderRadius: 6,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {block.title || "Open"}
        </Button>
      </div>
    </Section>
  );
}

// ── email-image ───────────────────────────────────────────────────────────

export function EmailImage({ block }: BlockProps) {
  const img = mediaUrl(block.media);
  if (!img) return null;
  return (
    <Section {...blockData(block)} style={sectionStyle}>
      <Img
        src={img}
        alt={mediaAlt(block.media)}
        width="552"
        data-payload-field="media"
        style={{ width: "100%", maxWidth: 552, borderRadius: 8 }}
      />
    </Section>
  );
}

// ── email-divider ─────────────────────────────────────────────────────────

export function EmailDivider({ block, theme }: BlockProps) {
  return (
    <Section {...blockData(block)} style={{ ...sectionStyle, paddingTop: 8, paddingBottom: 8 }}>
      <Hr style={{ borderColor: theme.borderColor, margin: 0 }} />
    </Section>
  );
}

// ── email-spacer ──────────────────────────────────────────────────────────

export function EmailSpacer({ block }: BlockProps) {
  return <div {...blockData(block)} style={{ height: 24 }} />;
}

// ── email-footer ──────────────────────────────────────────────────────────

export function EmailFooter({ block, theme }: BlockProps) {
  return (
    <Section
      {...blockData(block)}
      style={{ ...sectionStyle, paddingTop: 24, paddingBottom: 32, textAlign: "center" }}
    >
      {block.title && (
        <Text
          data-payload-field="title"
          style={{
            fontFamily: theme.headingFont,
            color: theme.primaryColor,
            fontSize: 14,
            fontWeight: 600,
            margin: "0 0 8px",
          }}
        >
          {block.title}
        </Text>
      )}
      <div data-payload-field="body">
        <LexicalToReact
          doc={block.body}
          options={{
            textStyle: {
              fontFamily: theme.bodyFont,
              color: theme.mutedColor,
              fontSize: 12,
              lineHeight: 1.5,
              margin: "0 0 6px",
            },
          }}
        />
      </div>
    </Section>
  );
}

// ── slug → component map ──────────────────────────────────────────────────

export const EMAIL_BLOCK_COMPONENTS: Record<string, (props: BlockProps) => React.ReactNode> = {
  "email-header": EmailHeader,
  "email-hero": EmailHero,
  "email-text": EmailText,
  "email-button": EmailButton,
  "email-image": EmailImage,
  "email-divider": EmailDivider,
  "email-spacer": EmailSpacer,
  "email-footer": EmailFooter,
};
