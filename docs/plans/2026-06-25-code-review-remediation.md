# Template Code-Review Remediation (High + Medium) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use gli-toolkit:subagent-driven-development (or executing-plans) to implement this plan task-by-task.

**Goal:** Fix the 2 High + 5 Medium findings from the 2026-06-25 code review of `feature/theme1-import-parity` (nocms-template-storage). Low/cleanup items live in `wb-migration/CODE-REVIEW-BACKLOG.md`.

**Architecture:** Frontend template (Next.js 16 / React 19 / Tailwind v4) that fetches from a Payload CMS and builds with `output: export` (static). It has **no unit-test harness** — verify each task with `bunx tsc --noEmit` (clean), `bun run lint:direct-edit` (editor-contract coverage), `bun run build` (the canonical check the production export runs), and a targeted Playwright/manual render check where the fix is visual or runtime-only.

**Severity order:** Task 1 & 2 (a silently-dead logo + a whole-page crash) first, then the Medium behavioral fixes.

---

### Task 1 — `fetchTenantLogo` rejects relative media URLs (+ no draft) [HIGH]

**Problem:** `src/lib/payload.ts` `fetchTenantLogo` ends with `return url && /^https?:\/\//i.test(url) ? url : null;`. nocms media is served via a **relative** same-origin path (`/cms/api/media/file/…`, because `disablePayloadAccessControl` isn't set), so the imported brand logo's URL fails the `https?://` test → returns `null` → the header/footer fall back to the `skin.config` legacy-CDN hot-link (or the text mark). Every other image goes through `mediaUrl`, which returns the raw `.url` (relative) and renders fine — so this filter is simply inconsistent. Separately, the fetch omits `${DRAFT_QS}`, so a draft logo change never shows in the preview iframe.

**Files:**
- Modify: `src/lib/payload.ts` (`fetchTenantLogo`)
- Verify consumers (no change): `src/components/layout/Navbar.tsx`, `Footer.tsx` (both render `logoUrl` in `<img>`)

**Steps:**
1. Make the return consistent with `mediaUrl`: accept any non-empty string URL (relative **or** absolute) — e.g. `return typeof url === "string" && url.length > 0 ? url : null;`. Do NOT reject relative paths (the logo must behave like every other rendered image). Keep the bare-id guard (a 24-hex id is not a URL → null).
2. Append `${DRAFT_QS}` to the fetch query (matching `fetchTenant`) so a draft logo appears in the dev preview.
3. `bunx tsc --noEmit` (clean) + `bun run lint:direct-edit`.
4. **Verify render:** with a project imported and a brand logo present, load the preview and confirm the header/footer show the **nocms-hosted** logo (not the legacy hot-link / text mark). A quick Playwright check: the header `<img>`'s `src` resolves 200 and is the nocms media path.
5. Commit: `fix(payload): fetchTenantLogo accepts relative nocms media URLs (+ draft) so the imported logo renders`.

**Note:** confirm during verify that relative media URLs actually resolve on the template origin the way other images do (proxy / build-time handling). If other images are themselves broken cross-origin, that's a broader media-origin issue — flag it, don't silently expand this task.

---

### Task 2 — `resolveIcon` renders a non-component object → page/build crash [HIGH]

**Problem:** `src/components/blocks/FeaturesGridBlock.tsx` `resolveIcon` (~63–79) returns `candidate` when `typeof candidate === "function" || typeof candidate === "object"`. lucide-react's `icons` export is a non-component **object**, reachable when `item.icon` normalizes to `"icons"` (a legacy `fa-icons`/`faIcons` ref). It's then rendered as `<Icon/>` → "Element type is invalid". With no error boundary under `output: export`, this throws during the page's server render and can **fail the static build**.

**Files:**
- Modify: `src/components/blocks/FeaturesGridBlock.tsx` (`resolveIcon`)

**Steps:**
1. Tighten the type check to render functions only — drop the `|| typeof candidate === "object"` branch (lucide icons are function components; `forwardRef` components are objects with `$$typeof`, so if a future lucide build uses those, guard on `typeof === "function" || candidate?.$$typeof` rather than any object). Simplest safe form: accept only `typeof candidate === "function"`; fall through to the keyword/positional fallback otherwise.
2. `bunx tsc --noEmit`.
3. **Verify:** render a features-grid whose `item.icon` is `"icons"` (and a normal value) — the `"icons"` case must fall back to a keyword/positional icon, not crash. (Quick Playwright render of a page with such a block, or a temporary fixture route like the `/mapcheck` pattern, deleted after.)
4. Commit: `fix(features-grid): resolveIcon only renders function components (lucide 'icons' object crashed the page)`.

---

### Task 3 — Leading `media-overlay` block suppresses the page header + CTA [MED]

**Problem:** `src/components/blocks/page-header.ts` `pageLeadsWithHero` returns true when the first block is `hero` **or** `media-overlay`, and `PageDocument` uses that to suppress both the H1/breadcrumb header and the pre-footer "View All Locations" band. A `media-overlay` is a generic image/banner, not necessarily a page header — so any imported content page that happens to start with one silently loses its title, breadcrumbs, and CTA.

**Files:**
- Modify: `src/components/blocks/page-header.ts` (`pageLeadsWithHero`) and/or `src/components/blocks/PageDocument.tsx`

**Steps:**
1. Decide the intended contract: a leading `hero` is a page header (suppress chrome); a leading `media-overlay` should **not** automatically suppress the header/CTA unless it's genuinely full-bleed. Narrow `pageLeadsWithHero` to `hero` (+ `home`/empty slug), or gate `media-overlay` on a `settings`/full-bleed signal.
2. `bunx tsc --noEmit`.
3. **Verify:** a content page whose first block is `media-overlay` renders its H1 + breadcrumbs + CTA band; a `hero`-led page still suppresses them.
4. Commit: `fix(page-header): don't treat a leading media-overlay as a full-bleed page header`.

---

### Task 4 — `isIndexPage` exact-slug match → self-linking CTA [MED]

**Problem:** `src/components/blocks/PageDocument.tsx:29` `isIndexPage = !!locationsIndexSlug && page.slug === locationsIndexSlug`. A normalization mismatch (trailing slash, or `locationsIndexSlug` null from a failed fetch) on a non-hero-led index page renders the "View All Locations" CTA on the index page itself, linking to where you already are.

**Files:**
- Modify: `src/components/blocks/PageDocument.tsx`

**Steps:**
1. Normalize both sides before comparing (strip leading/trailing slashes) so `all-locations` and `all-locations/` match; treat a null `locationsIndexSlug` defensively (don't render the self-link when the page's slug equals the CTA's fallback target `all-locations`).
2. `bunx tsc --noEmit`.
3. **Verify:** the all-locations index page does NOT render the "View All Locations" band (regardless of trailing-slash); a normal content page still does.
4. Commit: `fix(page-document): normalize index-slug match so the locate CTA never self-links`.

---

### Task 5 — `NoticeBar` dismissal not persisted [MED]

**Problem:** `src/components/layout/NoticeBar.tsx:12` holds dismissal in component-local `useState(true)` with no persistence, so the bar reappears on every hard reload / new visit.

**Files:**
- Modify: `src/components/layout/NoticeBar.tsx`

**Steps:**
1. Persist dismissal in `localStorage` keyed by a hash of the notice text (so a NEW notice re-shows): on mount read `localStorage["nocms-notice-dismissed"] === <hash>`; on dismiss, write the hash. SSR-safe (guard `typeof window`); initialize `visible` from the stored value in an effect to avoid hydration mismatch.
2. `bunx tsc --noEmit`.
3. **Verify:** dismiss the bar, reload — it stays dismissed; change the notice text — it re-appears.
4. Commit: `fix(notice): persist NoticeBar dismissal (localStorage, keyed by notice text)`.

---

### Task 6 — `LocationsMap` effect re-creates the map / leaks [MED, latent]

**Problem:** `src/components/content/LocationsMap.tsx:178` lists `markers` (a non-primitive array) in the effect deps, and cleanup only flips a `cancelled` flag — it never disposes the prior `google.maps.Map`/markers/listeners. Not currently triggered (markers is a stable server-component prop under `output: export`), but a future client re-render with a fresh `markers` reference would stack maps on the same div and leak.

**Files:**
- Modify: `src/components/content/LocationsMap.tsx`

**Steps:**
1. Make the dep stable: depend on `[apiKey]` plus a stable marker key (e.g. `markers.map(m => `${m.lat},${m.lng}`).join("|")`), or memoize markers in the caller. In cleanup, dispose: clear markers (`marker.map = null`), close info windows, and drop the map instance.
2. `bunx tsc --noEmit`.
3. **Verify:** the map still renders + fits bounds on a page with a key + markers (Playwright, like the earlier `/mapcheck` check); no duplicate `.gm-style` nodes after a re-render.
4. Commit: `fix(locations-map): stable effect deps + dispose map on cleanup (prevent stacked maps/leak)`.

---

## Final step

After all 6 tasks: `bunx tsc --noEmit` (clean) + `bun run lint:direct-edit` (clean) + `bun run build` (the production export check). Then use gli-toolkit:finishing-a-development-branch.
