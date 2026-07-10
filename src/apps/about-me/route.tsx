import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import { Hud } from './components/Hud'
import { Splash } from './components/Splash'
import { Stage } from './components/Stage'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return generateMeta(metadata)
}

export function links() {
  return [iconToFavicon(<AppIcon fill='transparent' padding={8} />)]
}

export default function App() {
  return (
    <Container id={metadata.id}>
      <Stage />
      <Hud />
      <Splash />
    </Container>
  )
}
