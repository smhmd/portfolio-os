import { AppWrapper } from 'src/components'
import { iconToFavicon } from 'src/utils'

import { Stage } from './components'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon padding={8} />)
  return [favicon]
}

export default function App() {
  return (
    <AppWrapper>
      <Stage />
    </AppWrapper>
  )
}
