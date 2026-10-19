type Entry = { count: number; resetAt: number };

export type RateLimiterOptions = {
  windowMs?: number;
  limit?: number;
  maxIdentifiers?: number;
};

/**
 * Local fallback limiter. Protects memory against arbitrary user-provided
 * identifier cardinality. Production serverless instances still require a
 * distributed edge/database-backed limit for global enforcement.
 */
export function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  limit = 5,
  maxIdentifiers = 10_000,
}: RateLimiterOptions = {}) {
  const attempts = new Map<string, Entry>();

  return function check(identifier: string, now = Date.now()) {
    const current = attempts.get(identifier);
    if (current && current.resetAt > now) {
      if (current.count >= limit) return { allowed: false, remaining: 0 };
      current.count += 1;
      return { allowed: true, remaining: limit - current.count };
    }

    if (current) attempts.delete(identifier);
    if (attempts.size >= maxIdentifiers) {
      // Prune expired entries first. Do not evict unexpired attempts: doing so
      // would permit a flood of unique identifiers to reset earlier limits.
      for (const [key, value] of attempts) {
        if (value.resetAt <= now) attempts.delete(key);
      }
      if (attempts.size >= maxIdentifiers) {
        return { allowed: false, remaining: 0 };
      }
    }

    attempts.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  };
}

export const checkRateLimit = createRateLimiter();
