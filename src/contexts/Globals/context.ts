import { createCtx } from 'src/lib/react'

export interface Globals {
  isAppDrawerOpen: React.RefObject<boolean>
  isReducedMotion: React.RefObject<boolean>
  width: number
  height: number
}

export const [GlobalsContext, useGlobals] = createCtx<Globals>()
