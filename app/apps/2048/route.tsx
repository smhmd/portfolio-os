import { useEffect, useMemo } from 'react'

import { useMachine, useSelector } from '@xstate/react'
import clsx from 'clsx'

import { Info } from 'app/assets'
import { AppWrapper } from 'app/components'
import type { API } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import { GameBoard, GameHeader } from './components'
import { type Events, machine } from './lib'
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

  const handle = useMemo<API<Events>>(() => {
    return {
      start: () => send({ type: 'start' }),
      continue: () => send({ type: 'continue' }),
      reset: () => send({ type: 'reset' }),
      move: (payload) => send({ type: 'move', payload }),
    }
  }, [])

  useEffect(() => {
    // Avoid SSR `window` is undefined behavior (cause we're using localStorage)
    handle.start()
  }, [])

  return (
    <AppWrapper
      isDark
      className='isolate flex flex-col items-center justify-between bg-[#F9F7EF] text-[#756452]'>
      <GameHeader
        onReset={handle.reset}
        className='z-1'
        score={score}
        best={best}
      />
      <GameBoard
        className='vsm:absolute inset-0 grow'
        board={board}
        onMove={handle.move}
        onContinue={handle.continue}
        onReset={handle.reset}
        isWon={isWon}
        isLost={isLost}
      />
      <footer
        className={clsx(
          'h-[24svh]',
          'vmd:block hidden items-center justify-center',
          'py-18 vxl:py-24 px-2',
          'text-center text-xs opacity-70',
        )}>
        <p>
          <Info
            aria-hidden
            className='mb-0.75 mr-1 inline size-4 fill-current'
          />
          <b>Swipe</b> or use <b>arrow keys</b> to merge tiles and make{' '}
          <b className='bg-yellow-500 text-white'>2048</b>
        </p>
      </footer>
    </AppWrapper>
  )
}
