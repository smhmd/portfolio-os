export type AppMetadata = {
  id: string
  name: string
  Icon: (props: React.ComponentProps<'svg'>) => JSX.Element
  isDarkThemed: boolean
}
