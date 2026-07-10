import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import {
  Base,
  Button,
  Frame,
  Keyboard,
  Parameter,
  Screen,
  Speaker,
  Volume,
} from './components'
import { api } from './lib'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return generateMeta(metadata)
}

export function links() {
  const favicon = iconToFavicon(
    <AppIcon fill='transparent' padding={13} wip={false} />,
  )
  return [favicon, { rel: 'stylesheet', href: styles }]
}

export default function App() {
  return (
    <Container
      id={metadata.id}
      className='bg-linear-to-br relative from-zinc-700 to-zinc-950 text-black'>
      <div className='wp-[noise.png] pointer-events-none absolute inset-0 bg-repeat opacity-30 mix-blend-overlay' />

      <Frame>
        <Speaker />
        <Volume onChange={api.changeVolume} onMute={api.muteVolume} />
        <Screen />
        <Parameter
          variant='blue'
          onChange={(delta) => api.changeParameter({ id: 'blue', delta })}
        />
        <Parameter
          variant='brown'
          onChange={(delta) => api.changeParameter({ id: 'brown', delta })}
        />
        <Parameter
          variant='gray'
          onChange={(delta) => api.changeParameter({ id: 'gray', delta })}
        />
        <Parameter
          variant='orange'
          onChange={(delta) => api.changeParameter({ id: 'orange', delta })}
        />
        <Base className='row-span-6' />

        <Button text='7' />
        <Button text='8' />
        <Button title='Backtrack' text='⌫' onClick={api.deleteControl} />

        <Button title='Tombola Sequencer' text='⬡' onClick={api.showTombola} />
        <Button title='Endless Sequencer' text='∞' onClick={api.showEndless} />
        <Button title='Pattern Sequencer' text='▦' onClick={api.showPattern} />
        <Button text='VI' />
        <Button text='V' />
        <Button text='VI' />
        <Button text='VII' />
        <Button text='VIII' />

        <Button text='4' />
        <Button text='5' />
        <Button text='6' />
        <Keyboard />
        <Button text='1' className='row-start-9' />
        <Button text='2' className='row-start-9' />
        <Button text='3' className='row-start-9' />
        <Button title='Left' text='<' onClick={api.leftControl} />
        <Button title='Right' text='>' onClick={api.rightControl} />
        <Button title='Play / pause' text='▶' onClick={api.playControl} />
      </Frame>
    </Container>
  )
}
