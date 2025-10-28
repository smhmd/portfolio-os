import type React from 'react'

import type { AppIconWrapper } from 'app/components'

export type AppMetadata = {
  id: string
  name: string
  description: string
  Icon: (
    props: React.ComponentProps<typeof AppIconWrapper>,
  ) => React.JSX.Element
}

export type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * Merges a React component's props with custom props, overriding conflicts.
 */
export type Props<C extends React.ElementType, P = object> = Omit<
  React.ComponentProps<C>,
  keyof P
> &
  P

/**
 * 'game.option.add.lazy' to "lazyAddOptionGame"
 */
type EventToFuncName<S extends string> = S extends `${infer H}.${infer T}`
  ? `${EventToFuncName<T>}${Capitalize<H>}`
  : S

/**
 * Generates a strongly-typed API object from an `Events` union.
 */
export type API<E extends { type: string; payload?: unknown }> = {
  [K in E['type'] as EventToFuncName<K>]: Extract<E, { type: K }> extends {
    payload: infer P
  }
    ? (payload: P) => void
    : () => void
}
