type Entry = { count: number; resetAt: number };
const attempts = new Map<string, Entry>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;

export function checkRateLimit(identifier: string, now = Date.now()) {
  const current = attempts.get(identifier);
  if (!current || current.resetAt <= now) {
    attempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }
  if (current.count >= LIMIT) return { allowed: false, remaining: 0 };
  current.count += 1;
  return { allowed: true, remaining: LIMIT - current.count };
}
