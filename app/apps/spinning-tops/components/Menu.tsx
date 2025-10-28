import { memo } from 'react'

import { useSelector } from '@xstate/react'
import clsx from 'clsx'

import { actor, difficulties, type PlayerID, useGame } from '../lib'
import { Countdown } from '.'

const playerTitle: Record<PlayerID, string> = {
  me: 'You',
  cpu: 'CPU',
}

export const Menu = memo(() => {
  const { spritesheet } = useGame()
  const { difficulty, winner, isGameOver, isMainMenu, isPlaying, isCountdown } =
    useSelector(actor, (state) => ({
      ...state.context,
      isGameOver: state.matches('GAME_OVER'),
      isMainMenu: state.matches('MAIN_MENU'),
      isPlaying: state.matches('PLAYING'),
      isCountdown: state.matches('COUNTDOWN'),
    }))

  function handleGameMenu() {
    actor.send({ type: 'game.menu' })
  }
  function handleGameCountdown() {
    actor.send({ type: 'game.countdown' })
  }
  function handleDifficultyCycle() {
    actor.send({ type: 'difficulty.cycle' })
  }

  const options = [
    {
      show: isGameOver,
      title: 'Main Menu',
      action: handleGameMenu,
    },
    {
      show: isGameOver || isMainMenu,
      title: isMainMenu ? 'Start Game' : 'Play Again',
      action: handleGameCountdown,
    },
    {
      show: isMainMenu,
      title: 'Difficulty',
      value: difficulties[difficulty],
      action: handleDifficultyCycle,
    },
  ]

  if (!spritesheet) return null
  if (isPlaying) return null

  if (isCountdown) return <Countdown />

  return (
    <div className='pointer-events-none'>
      <section
        aria-hidden={!isGameOver}
        className={clsx(
          isGameOver ? 'block' : 'hidden',
          'absolute inset-x-0 flex flex-col items-center justify-center',
          'vsm:top-[8vh] vlg:top-[12vh] vxl:top-[18vh] v2xl:top-[20vh] top-[6vh]',
        )}>
        <img
          className='l:vsm:size-28 l:vmd:size-44 l:size-20 size-28 sm:size-44'
          src='/spinning-tops/winner.png'
        />
        <span className='text-shadow-cyan-glow l:vsm:text-3xl l:vmd:text-5xl l:text-xl text-3xl sm:text-5xl'>
          {winner && playerTitle[winner]} Won
        </span>
      </section>

      <section
        className={clsx(
          'absolute inset-0 flex flex-col items-center justify-center gap-y-2',
          'mb-4 text-xl',
        )}>
        <ul className='w-full max-w-xs px-4'>
          {options.map(({ show = true, title, value, action }, i) =>
            show ? (
              <li key={i}>
                <button
                  className={clsx(
                    'pointer-events-auto flex w-full cursor-none justify-between',
                    'outline-none transition-[text-shadow] duration-100 ease-in',
                    'hover:text-shadow-cyan-glow focus:text-shadow-cyan-glow',
                    value || 'mb-4 justify-center',
                  )}
                  onClick={action}>
                  <span>{title}</span>
                  <span className='capitalize'>{value}</span>
                </button>
              </li>
            ) : null,
          )}
        </ul>
      </section>
    </div>
  )
})

Menu.displayName = 'Menu'
