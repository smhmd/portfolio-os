import { createCtx } from 'app/utils'

export interface Globals {
  isAppDrawerOpen: React.RefObject<boolean>
  width: number
  height: number
}

export const [GlobalsContext, useGlobals] = createCtx<Globals>()
