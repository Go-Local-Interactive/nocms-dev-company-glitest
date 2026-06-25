import { Body, Container, Head, Html, Preview } from "@react-email/components";
import { EMAIL_BLOCK_COMPONENTS } from "./blocks";
import type { EmailTheme } from "./theme";

interface EmailDocumentProps {
  docId: string;
  subject?: string;
  preheader?: string;
  blocks: Array<Record<string, unknown>>;
  theme: EmailTheme;
}

export function EmailDocument({ docId, subject, preheader, blocks, theme }: EmailDocumentProps) {
  return (
    <Html
      lang="en"
      data-payload-doc-id={docId}
      data-payload-collection="emails"
    >
      <Head>
        <title>{subject ?? ""}</title>
        <meta name="x-apple-disable-message-reformatting" />
      </Head>
      {preheader && <Preview>{preheader}</Preview>}
      <Body
        style={{
          backgroundColor: theme.bodyColor,
          fontFamily: theme.bodyFont,
          color: theme.textColor,
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: 600,
            margin: "32px auto",
            borderRadius: 12,
            border: `1px solid ${theme.borderColor}`,
            overflow: "hidden",
          }}
        >
          {blocks.map((b, i) => {
            const blockType = b?.blockType as string | undefined;
            if (!blockType) return null;
            const Component = EMAIL_BLOCK_COMPONENTS[blockType];
            if (!Component) return null;
            return <Component key={(b?.id as string) ?? `b-${i}`} block={b} theme={theme} />;
          })}
        </Container>
      </Body>
    </Html>
  );
}
