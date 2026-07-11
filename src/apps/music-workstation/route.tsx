import {
  ArrowLeft,
  ArrowRight,
  Backspace,
  Circle,
  Download,
  Grid,
  Hexagon,
  Pattern,
  Play,
  Replay,
  SpaceBar,
  Square,
} from 'src/assets'
import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import {
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

        <Button
          text='Reset'
          icon={Replay}
          onClick={() => api.control('reset')}
        />
        <Button
          text='Left'
          icon={ArrowLeft}
          onClick={() => api.control('left')}
        />
        <Button
          text='Right'
          icon={ArrowRight}
          onClick={() => api.control('right')}
        />
        <Button text='Play' icon={Play} onClick={() => api.control('play')} />
        <Button text='Record' icon={Circle} onClick={api.record} />
        <Button text='Stop' icon={Square} onClick={api.stopRecording} />
        <Button text='Download' icon={Download} onClick={api.download} />
        <Button
          text='Space'
          icon={SpaceBar}
          onClick={() => api.control('space')}
        />
        <Button
          text='Delete'
          icon={Backspace}
          onClick={() => api.control('delete')}
        />

        <Keyboard />
        <Button
          className='col-start-5 row-start-7'
          text='Tombola Sequencer'
          icon={Hexagon}
          onClick={() => api.show('TOMBOLA')}
        />
        <Button
          className='col-start-5 row-start-9'
          text='Endless Sequencer'
          icon={Pattern}
          onClick={() => api.show('ENDLESS')}
        />
        <Button
          className='col-start-5 row-start-11'
          text='Pattern Sequencer'
          icon={Grid}
          onClick={() => api.show('PATTERN')}
        />
      </Frame>
    </Container>
  )
}
