import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import { Background, Controls, Stage } from './components'
import { DICE_FONT_NAME } from './lib'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return generateMeta(metadata)
}

export function links() {
  const favicon = iconToFavicon(
    <AppIcon fill='transparent' padding={14} wip={false} />,
  )
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${DICE_FONT_NAME}:wght@700&display=swap`, // &text=D0123456789.
    },
  ]
}

export default function App() {
  return (
    <Container id={metadata.id} className='relative bg-[crimson]'>
      <Background />
      <Stage />
      <Controls />
    </Container>
  )
}
