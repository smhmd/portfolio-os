import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import { Splash, Stage } from './components/'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return generateMeta(metadata)
}

export function links() {
  const favicon = iconToFavicon(<AppIcon fill='transparent' padding={8} />)
  return [
    favicon,
    { rel: 'stylesheet', href: styles },
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@700&display=swap`,
    },
  ]
}

export default function App() {
  return (
    <Container
      id={metadata.id}
      className='font-josefin-slab bg-radial-[circle_at_bottom,#18233c_0%,#18233c_30%,#050510_80%]'>
      <Stage />
      <Splash />
    </Container>
  )
}
