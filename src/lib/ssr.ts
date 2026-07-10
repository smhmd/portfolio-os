import { isClient } from './env'

/**
 * SSR-friendly wrapper to run client-only code (e.g. `document`, `window`)
 */
export function clientOnly<T>(factory: () => T, fallback?: unknown): T {
  // if server, return fallback; otherwise run factory
  if (isClient) return factory()
  return fallback as T
}

/**
 * Promisified SSR-friendly wrapper to run client-only code (e.g. `document`, `window`)
 */
export async function clientOnlyPromise<T>(
  factory: () => Promise<T>,
  fallback?: unknown,
) {
  if (isClient) return factory()
  return Promise.resolve(fallback as T)
}
