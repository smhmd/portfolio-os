import { isClient } from './constants'

export async function clientOnlyPromise<T>(factory: () => Promise<T>) {
  return isClient ? factory() : Promise.resolve()
}

export function clientOnly<T>(factory: () => T): T {
  return (isClient ? factory() : undefined)!
}
