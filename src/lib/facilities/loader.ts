/**
 * Static facilities loader. Reads JSON files written at scaffold time by the
 * agent's `fetchXFacilities` MCP tool. The data lives at:
 *
 *   src/lib/facilities/data/index.json   — slim list (FacilityIndexEntry[])
 *   src/lib/facilities/data/{slug}.json  — full Facility per slug
 *
 * Only intended for Server Components / Route Handlers. The `fs` import means
 * importing this file from a `"use client"` boundary would break the build —
 * which is the desired guardrail.
 *
 * No fetch, no network. The agent re-runs the scaffold to refresh data.
 */

import fs from "node:fs/promises";
import path from "node:path";
import type { Facility, FacilityIndexEntry } from "../../types/Facility";

const DATA_DIR = path.join(process.cwd(), "src/lib/facilities/data");

export async function listFacilities(): Promise<FacilityIndexEntry[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "index.json"), "utf-8");
    return JSON.parse(raw) as FacilityIndexEntry[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function getFacility(slug: string): Promise<Facility | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${slug}.json`), "utf-8");
    return JSON.parse(raw) as Facility;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}
