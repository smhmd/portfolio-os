import { useCallback } from 'react'

import { useMachine, useSelector } from '@xstate/react'

import { AppIcon, AppWrapper } from 'app/components'
import { type AppMetadata, destination, initToneOnClick } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import {
  Button,
  Frame,
  Keyboard,
  Parameter,
  Screen,
  Speaker,
  Volume,
} from './components'
import { machine } from './lib'
import styles from './styles.css?url'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: '2048' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [
    favicon,
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap',
    },
    { rel: 'stylesheet', href: styles },
  ]
}

export default function App() {
  const [_, send, actor] = useMachine(machine)
  const { volume } = useSelector(actor, ({ context }) => context)

  const handleAttackNote = useCallback((note: string) => {
    send({ type: 'ATTACK_NOTE', payload: note })
  }, [])

  const handleReleaseNote = useCallback(() => {
    console.log(destination?.volume.value)
    send({ type: 'RELEASE_NOTE' })
  }, [])

  return (
    <AppWrapper isDark isFullscreen>
      <Frame>
        <Speaker />
        <Volume />
        <Screen>
          <span>Volume: {volume}</span>
        </Screen>
        <Parameter variant='blue' />
        <Parameter variant='brown' />
        <Parameter variant='gray' />
        <Parameter variant='orange' />
        <Button
          onClick={async () => {
            await initToneOnClick()
          }}>
          START
        </Button>
        <Button />
        <Button />
        <Button />
        <Button
          onClick={async () => {
            send({ type: 'CHANGE_VOLUME', payload: 1 })
          }}>
          +
        </Button>
        <Button
          onClick={async () => {
            send({ type: 'CHANGE_VOLUME', payload: -1 })
          }}>
          -
        </Button>
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Keyboard
          onAttackNote={handleAttackNote}
          onReleaseNote={handleReleaseNote}
        />
        <Button className='row-start-9' />
        <Button className='row-start-9' />
        <Button className='row-start-9' />
        <Button />
        <Button />
        <Button />
      </Frame>
    </AppWrapper>
  )
}

export const metadata: AppMetadata = {
  id: 'drum-machine',
  name: 'Drum Machine',
  Icon: (props) => (
    <AppIcon fill='#ca5057' {...props}>
      <path
        d='M27.833 71h5.833m-5.833-7h5.833m-5.833-7h5.833m-5.833-7h5.833m7 21H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m7 42h5.833m7 0h5.833M53.5 64h5.833m7 0h5.833M53.5 57h5.833m7 0h5.833m-5.833-7h5.833m-5.833-7h5.833'
        stroke='#E6E6E6'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </AppIcon>
  ),
}
