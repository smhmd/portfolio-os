import { isClient } from './constants'

/**
 * SSR-friendly wrapper to run client-only code (e.g. `document`, `window`)
 */
export function clientOnly<T>(factory: () => T): T {
  return (isClient ? factory() : undefined)!
}

/**
 * Promisified SSR-friendly wrapper to run client-only code (e.g. `document`, `window`)
 */
export async function clientOnlyPromise<T>(factory: () => Promise<T>) {
  return isClient ? factory() : Promise.resolve()
}
