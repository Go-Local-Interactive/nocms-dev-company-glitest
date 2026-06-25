/**
 * In-memory sliding-window rate limiter for nocms backend calls.
 *
 * The nocms v3 proxy throttles per-key on its end, but we keep a conservative
 * client-side limiter so a burst of card hovers / live-filter toggles doesn't
 * cause spurious 429s. This is the simpler in-memory variant — use the
 * file-shared limiter from storage-theme-payload only if static generation
 * across multiple workers becomes a real concern.
 *
 * Shape mirrors the storage-theme-payload `seApiRateLimiter` so callers can
 * read either codebase without re-learning.
 */

const MAX_REQUESTS_PER_MINUTE = 250;
const WINDOW_MS = 60 * 1000;
const MIN_DELAY_MS = 50;

const state = {
  requestTimestamps: [] as number[],
  pendingRequests: 0,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pruneOldTimestamps(): void {
  const cutoff = Date.now() - WINDOW_MS;
  state.requestTimestamps = state.requestTimestamps.filter((t) => t > cutoff);
}

function getCurrentCount(): number {
  pruneOldTimestamps();
  return state.requestTimestamps.length + state.pendingRequests;
}

function getWaitMs(): number {
  pruneOldTimestamps();
  const count = state.requestTimestamps.length + state.pendingRequests;
  if (count < MAX_REQUESTS_PER_MINUTE) {
    if (state.requestTimestamps.length === 0) return 0;
    const last = state.requestTimestamps[state.requestTimestamps.length - 1];
    const since = Date.now() - last;
    return since < MIN_DELAY_MS ? MIN_DELAY_MS - since : 0;
  }
  // Window full — wait until the oldest request ages out.
  const oldest = state.requestTimestamps[0];
  return Math.max(0, oldest + WINDOW_MS - Date.now());
}

export const apiRateLimiter = {
  async waitForSlot(): Promise<void> {
    state.pendingRequests++;
    try {
      let wait = getWaitMs();
      while (wait > 0) {
        await sleep(wait);
        wait = getWaitMs();
      }
      state.requestTimestamps.push(Date.now());
    } finally {
      state.pendingRequests--;
    }
  },
  /** For tests / observability. */
  snapshot() {
    pruneOldTimestamps();
    return {
      windowCount: state.requestTimestamps.length,
      pending: state.pendingRequests,
      cap: MAX_REQUESTS_PER_MINUTE,
    };
  },
};
