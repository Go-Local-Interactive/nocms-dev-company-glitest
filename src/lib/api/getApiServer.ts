/**
 * Resolve the nocms backend base URL from the environment.
 *
 * The nocms backend exposes the v3 proxy contract documented across the
 * monument-* skills. All FMS data calls from this site go through it; we never
 * hit a vendor API directly.
 */
export function getApiServer(): string {
  const base = process.env.NEXT_PUBLIC_API_SERVER;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_SERVER is not set. Add it to .env.local.");
  }
  return base.replace(/\/$/, "");
}
