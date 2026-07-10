import { createCtx } from 'src/lib/react'
import type { AppMetadata } from 'src/lib/types'

export const [CurrentAppContext, useCurrentApp] = createCtx<AppMetadata>()
