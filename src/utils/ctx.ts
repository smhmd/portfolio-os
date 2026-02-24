import { createContext, useContext } from 'react'

export function createCtx<T>() {
  const context = createContext<T | undefined>(undefined)

  const useCtx = () => {
    const ctx = useContext(context)

    if (!ctx) throw new Error('useContext must be used within Context.Provider')
    return ctx
  }

  return [context, useCtx] as const
}
