import type { AppMetadata } from 'app/lib'
import { createCtx } from 'app/utils'

export const [CurrentAppContext, useCurrentApp] = createCtx<AppMetadata>()
