export type AppMetadata = {
  id: string
  name: string
  description: string
  Icon: (props: React.ComponentProps<'svg'>) => JSX.Element
}
