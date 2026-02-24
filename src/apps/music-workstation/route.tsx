import { useMemo } from 'react'

import { useMachine, useSelector } from '@xstate/react'

import { AppWrapper } from 'src/components'
import { initToneOnClick } from 'src/lib'
import { iconToFavicon } from 'src/utils'

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
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(
    <AppIcon fill='transparent' padding={13} wip={false} />,
  )
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
  useSelector(actor, ({ context }) => context)

  const handle = useMemo(
    () => ({
      attackNote(note: string) {
        send({ type: 'ATTACK_NOTE', payload: note })
      },
      releaseNote() {
        send({ type: 'RELEASE_NOTE' })
      },
      increaseVolume() {
        send({ type: 'CHANGE_VOLUME', payload: 1 })
      },
      decreaseVolume() {
        send({ type: 'CHANGE_VOLUME', payload: -1 })
      },
    }),
    [],
  )

  return (
    <AppWrapper isDark className='bg-gray-100'>
      <Frame>
        <Speaker />
        <Volume />
        <Screen />
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
        <Button onClick={handle.increaseVolume}>+</Button>
        <Button onClick={handle.decreaseVolume}>-</Button>
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
          onAttackNote={handle.attackNote}
          onReleaseNote={handle.releaseNote}
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
