import type { AppIconWrapper } from 'app/components'

export type AppMetadata = {
  id: string
  name: string
  description: string
  Icon: (props: React.ComponentProps<typeof AppIconWrapper>) => JSX.Element
}
