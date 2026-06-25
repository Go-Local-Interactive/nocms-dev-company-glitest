import * as React from "react";
import * as LucideIcons from "lucide-react";
import {
  Truck,
  FileX,
  Lock,
  KeyRound,
  Package,
  Thermometer,
  BadgePercent,
  Video,
  CreditCard,
  FileText,
  Car,
  HeartHandshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { BlockProps, LexicalNode } from "./types";
import type { PayloadBlockItem } from "@/lib/payload";
import { lexicalListItems, lexicalToText } from "./Lexical";

/** Deterministic fallback rotation, ordered to match the legacy feature set
 *  (Truck Rental, No Contracts, Free Lock, Gated/Code Access, Supplies, Climate,
 *  Military Discounts, Video Surveillance, Online Bill Pay, Paperless, Drive-up,
 *  Insurance). Used positionally when no per-item icon is supplied. */
const FALLBACK_ICONS: LucideIcon[] = [
  Truck,
  FileX,
  Lock,
  KeyRound,
  Package,
  Thermometer,
  BadgePercent,
  Video,
  CreditCard,
  FileText,
  Car,
  HeartHandshake,
];

/** Keyword → icon, so a feature NAME (the only signal available before the
 *  items[] enrichment migration lands) gets a sensible icon instead of a
 *  position-only guess. First match wins; falls back to positional rotation. */
const NAME_ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/truck|haul|move|moving/i, Truck],
  [/no contract|month.to.month|no commit/i, FileX],
  [/lock/i, Lock],
  [/gate|code|access|keypad|entry/i, KeyRound],
  [/suppl|box|pack/i, Package],
  [/climate|temperature|heat|cool|controlled/i, Thermometer],
  [/military|discount|senior|student/i, BadgePercent],
  [/video|surveil|camera|monitor|cctv/i, Video],
  [/bill|pay|payment|online/i, CreditCard],
  [/paperless|statement|document|invoice/i, FileText],
  [/drive.?up|drive.?in|vehicle|car|rv|boat/i, Car],
  [/insur|protect|coverage/i, HeartHandshake],
  [/secur|safe|guard|defend/i, ShieldCheck],
];

/** Resolve an explicit lucide icon name from items[].icon (PascalCase, kebab,
 *  or emoji). Returns the component, an emoji string, or null. */
function resolveIcon(name?: string | null): LucideIcon | string | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  // Emoji / non-identifier → render the glyph as-is.
  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(trimmed)) return trimmed;
  const pascal = trimmed
    .replace(/(^|[-_\s])(\w)/g, (_, __, c: string) => c.toUpperCase())
    .replace(/[-_\s]/g, "");
  // lucide-react exposes every icon as a named export; index defensively.
  const lib = LucideIcons as Record<string, unknown>;
  const candidate = lib[pascal] ?? lib[trimmed];
  // Only return a RENDERABLE component: a function component, or a forwardRef/
  // memo object (which carries `$$typeof`). lucide also exports non-component
  // objects — notably `icons` (a record of icon nodes); rendering that as a JSX
  // element throws "Element type is invalid" and crashes the page, so reject any
  // plain object without `$$typeof`.
  const isComponent =
    typeof candidate === "function" ||
    (typeof candidate === "object" && candidate !== null && "$$typeof" in candidate);
  return isComponent ? (candidate as LucideIcon) : null;
}

function iconForName(name: string, index: number): LucideIcon {
  for (const [re, icon] of NAME_ICON_RULES) {
    if (re.test(name)) return icon;
  }
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

function IconSlot({ icon }: { icon: LucideIcon | string }) {
  if (typeof icon === "string") {
    return (
      <span className="text-primary text-2xl shrink-0 leading-none" aria-hidden="true" data-nocms-component="features-grid-block">
        {icon}
      </span>
    );
  }
  const Icon = icon;
  return <Icon className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />;
}

/** A pill-style feature card: name (bold, left) + icon (primary, right) on a
 *  primary-light background — matches legacy FeaturesGrid Layout 2. */
function FeatureCard({
  name,
  description,
  icon,
}: {
  name: string;
  description?: string;
  icon: LucideIcon | string;
}) {
  return (
    <li className="flex items-center gap-3 bg-primary-light rounded-lg px-5 py-5">
      <div className="min-w-0">
        <div className="font-body text-base font-bold text-text">{name}</div>
        {description && (
          <p className="font-body text-sm text-muted mt-1 leading-snug" data-role="subheading">{description}</p>
        )}
      </div>
      <div className="ml-auto flex items-center">
        <IconSlot icon={icon} />
      </div>
    </li>
  );
}

interface Card {
  name: string;
  description?: string;
  icon: LucideIcon | string;
}

/** Build cards from the enriched items[] atom (icon + label + text). Returns
 *  null when items aren't present so the caller falls back to the body list. */
function cardsFromItems(items?: PayloadBlockItem[] | null): Card[] | null {
  if (!items?.length) return null;
  const cards: Card[] = items.map((item, i) => {
    const name = item.label?.trim() || "Feature";
    const description = item.text ? lexicalToText(item.text) || undefined : undefined;
    const resolved = resolveIcon(item.icon);
    return { name, description, icon: resolved ?? iconForName(name, i) };
  });
  return cards.length > 0 ? cards : null;
}

/** Build cards from the body bullet list (the current migration output: feature
 *  names only). Each name maps to a keyword/positional icon; no description. */
function cardsFromBody(body: BlockProps["body"]): Card[] {
  return lexicalListItems(body).map((name, i) => ({
    name,
    icon: iconForName(name, i),
  }));
}

/** Features grid — legacy "Built to Make Storage Easy" (FeaturesGrid Layout 2).
 *  Centered heading + intro above a responsive grid of feature pill cards
 *  (1-up mobile → 3-up tablet → 4-up desktop). Renders the enriched items[]
 *  atom (icon + name + description) when present; otherwise styles the body
 *  bullet list of feature names with sensible icons. */
export function FeaturesGridBlock({ title, body, items, links }: BlockProps) {
  const cards = cardsFromItems(items) ?? cardsFromBody(body);
  if (cards.length === 0) return null;
  const cta = links?.[0];

  // body holds an optional intro paragraph ahead of the bullet list — surface
  // it as the centered description (legacy renders a description above the grid).
  const intro = introText(body);

  return (
    <section
      data-nocms-component="features-grid"
      className="bg-background py-12 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center text-center max-w-3xl mb-10 md:mb-12">
          {title && (
            <h2
              data-payload-subfield="title"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text"
              style={{ textWrap: "balance" } as React.CSSProperties} data-role="heading"
            >
              {title}
            </h2>
          )}
          {intro && (
            <p
              data-payload-subfield="body"
              className="font-body text-base md:text-lg text-muted mt-3 leading-relaxed" data-role="subheading-2"
            >
              {intro}
            </p>
          )}
        </div>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
          data-payload-subfield="body"
          aria-label="Storage features"
        >
          {cards.map((card, i) => (
            <FeatureCard
              key={i}
              name={card.name}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </ul>
        {/* legacy "View All Features" CTA below the grid (buttonLink → links[0]). */}
        {cta?.url && (
          <a
            href={cta.url}
            className="inline-flex items-center justify-center bg-primary text-white font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition mt-8" data-role="cta"
          >
            {cta.label ?? "View All Features"}
          </a>
        )}
      </div>
    </section>
  );
}

/** Plain text of the body's non-list prose — the description paragraph(s) that
 *  precede the bullet list. Walks the top-level nodes and joins everything that
 *  isn't a list, so the list-item names (which become cards) are excluded. */
function introText(body: BlockProps["body"]): string | undefined {
  const children = body?.root?.children;
  if (!children?.length) return undefined;
  const parts: string[] = [];
  for (const node of children) {
    if (node.type === "list") continue;
    const text = nodeText(node).trim();
    if (text) parts.push(text);
  }
  const joined = parts.join(" ").trim();
  return joined.length > 0 ? joined : undefined;
}

/** Recursively collect text from a single lexical node. */
function nodeText(node: LexicalNode): string {
  const out: string[] = [];
  const walk = (n: LexicalNode) => {
    if (n.type === "text" && typeof n.text === "string") out.push(n.text);
    n.children?.forEach(walk);
  };
  walk(node);
  return out.join(" ");
}
