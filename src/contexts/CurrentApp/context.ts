import type { AppMetadata } from 'src/lib'
import { createCtx } from 'src/utils'

export const [CurrentAppContext, useCurrentApp] = createCtx<AppMetadata>()
