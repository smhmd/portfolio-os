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
