import { useCallback } from 'react'

import { useMachine, useSelector } from '@xstate/react'

import { AppWrapper } from 'app/components'
import { initToneOnClick } from 'app/lib'
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
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon />)
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
    send({ type: 'RELEASE_NOTE' })
  }, [])

  return (
    <AppWrapper className='bg-white'>
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
