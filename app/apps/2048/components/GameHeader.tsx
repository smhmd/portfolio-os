import { memo } from 'react'

import clsx from 'clsx'

import { Replay } from 'app/assets'

import { Score } from './Score'

type GameHeaderProps = {
  onReset: () => void
  score: number
  best: number
} & React.ComponentProps<'header'>

export const GameHeader = memo(
  ({ score, best, onReset, className, ...rest }: GameHeaderProps) => (
    <header
      className={clsx(
        'grid w-full items-center gap-y-2 px-2 sm:px-8',
        'grid-cols-3 grid-rows-2 md:grid-cols-3 md:grid-rows-1',
        className,
      )}
      {...rest}>
      <h1
        className={clsx(
          'text-5xl font-black',
          'col-start-2 place-self-center sm:col-start-1 sm:place-self-auto',
        )}>
        2048
      </h1>

      <button
        className={clsx('justify-self-end rounded-lg', 'col-start-3')}
        onClick={onReset}>
        <Replay aria-hidden className='fill-current sm:hidden' />
        <span
          className={clsx(
            'hidden rounded-lg sm:block',
            'bg-board text-base text-white',
            'cursor-pointer whitespace-nowrap',
            'px-4 py-2',
          )}>
          New Game
        </span>
      </button>

      <Score
        className='col-span-3 md:col-span-1 md:col-start-2 md:row-start-1'
        score={score}
        best={best}
      />
    </header>
  ),
)

GameHeader.displayName = 'GameHeader'
