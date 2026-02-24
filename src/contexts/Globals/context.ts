import { createCtx } from 'src/utils'

export interface Globals {
  isAppDrawerOpen: React.RefObject<boolean>
  width: number
  height: number
}

export const [GlobalsContext, useGlobals] = createCtx<Globals>()
