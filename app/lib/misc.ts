import { isClient } from './constants'

export async function createClientPromise<T>(p: Promise<T>) {
  return isClient ? p : Promise.resolve()
}

export function clientOnly<T>(factory: () => T): T {
  return (isClient ? factory() : undefined)!
}
