import { useCallback, useEffect } from 'react'

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

  const handleMove = useCallback((direction: Direction) => {
    send({ type: 'move', payload: direction })
  }, [])
  const handleContinue = useCallback(() => {
    send({ type: 'continue' })
  }, [])
  const handleReset = useCallback(() => {
    send({ type: 'reset' })
  }, [])

  useEffect(() => {
    // Avoid SSR `window` is undefined behavior (cause we're using localStorage)
    send({ type: 'start' })
  }, [])

  return (
    <AppWrapper
      isDark
      className='flex flex-col items-center justify-center bg-[#F9F7EF] text-[#756452]'>
      <GameHeader
        handleReset={handleReset}
        className='absolute inset-x-0 top-10'
        score={score}
        best={best}
      />
      <GameBoard
        board={board}
        handleMove={handleMove}
        handleContinue={handleContinue}
        handleReset={handleReset}
        isWon={isWon}
        isLost={isLost}
      />
      <footer className='absolute bottom-[5vh] text-xs opacity-70'>
        Originally created by Gabriele Cirulli.
      </footer>
    </AppWrapper>
  )
}
