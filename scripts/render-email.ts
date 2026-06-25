// scripts/render-email.ts
//
// Stdin: JSON { docId, subject?, preheader?, blocks: [...], theme: {...} }
// Stdout: rendered HTML string
// Exit 0 on success; exit 1 with error to stderr on failure.
//
// Invoked by nocms's /api/render-email handler with `bun run` in this
// workspace's cwd. Module resolution and tsconfig paths scope to this
// workspace, so adding new block renderers under src/emails/* needs no
// nocms-side changes.
//
// Uses Node's process.stdin async iteration (works in Bun via its
// Node compat layer) so the script typechecks against @types/node
// without needing @types/bun.

import { render } from "@react-email/render";
import { EmailDocument } from "../src/emails/EmailDocument";
import type { EmailTheme } from "../src/emails/theme";

interface Input {
  docId: string;
  subject?: string;
  preheader?: string;
  blocks: Array<Record<string, unknown>>;
  theme: EmailTheme;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf-8");
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const input = JSON.parse(raw) as Input;
  const html = await render(EmailDocument(input));
  process.stdout.write(html);
}

main().catch((err) => {
  process.stderr.write(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
