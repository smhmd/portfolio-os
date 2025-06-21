import { useEffect, useMemo } from 'react'

import { useMachine, useSelector } from '@xstate/react'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { GameBoard, GameHeader } from './components'
import { type Direction, machine } from './lib'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon padding={13} />)
  return [favicon, { rel: 'stylesheet', href: styles }]
}

export default function App() {
  const [state, send, actor] = useMachine(machine)
  const { board, score, best, isWon, isLost } = useSelector(
    actor,
    (state) => ({
      ...state.context,
      isWon: state.matches('WON'),
      isLost: state.matches('LOST'),
    }),
    // if `updated` is not true, don't return new values for `board`, `score`, and `best`
    // saves us from unnecessary re-renders
    () => !state.context.updated,
  )

  const handle = useMemo(
    () => ({
      move(payload: Direction) {
        send({ type: 'move', payload })
      },
      continue() {
        send({ type: 'continue' })
      },
      reset() {
        send({ type: 'reset' })
      },
    }),
    [],
  )

  useEffect(() => {
    // Avoid SSR `window` is undefined behavior (cause we're using localStorage)
    send({ type: 'start' })
  }, [])

  return (
    <AppWrapper
      isDark
      className='flex flex-col items-center justify-center bg-[#F9F7EF] text-[#756452]'>
      <GameHeader
        onReset={handle.reset}
        className='absolute inset-x-0 top-10'
        score={score}
        best={best}
      />
      <GameBoard
        board={board}
        onMove={handle.move}
        onContinue={handle.continue}
        onReset={handle.reset}
        isWon={isWon}
        isLost={isLost}
      />
      <footer className='absolute bottom-[5vh] text-xs opacity-70'>
        Originally created by Gabriele Cirulli.
      </footer>
    </AppWrapper>
  )
}
