import { memo, useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

type ScoreProps = {
  score: number
  best: number
} & React.ComponentProps<'aside'>

let id = 0

export const Score = memo(
  ({ score, best, className, ...props }: ScoreProps) => {
    // Track previous score to calculate the difference(s) and animate it
    // Animates at the start of the game as well.
    const previousScore = useRef<number>(0)
    const [diffs, setDiffs] = useState<number[][]>([])

    useEffect(() => {
      const diff = score - previousScore.current
      if (diff) {
        setDiffs((d) => [...d, [id++, diff]].slice(-10))
      }

      previousScore.current = score
    }, [score])

    return (
      <aside
        className={clsx('flex justify-center gap-2', className)}
        {...props}>
        <ScoreDisplay
          className='relative bg-[#eae7d9]'
          name='score'
          value={score}>
          {diffs.map(([id, diff]) => (
            <span
              key={id}
              className={clsx(
                'absolute inset-0',
                'flex items-center justify-center',
                'animate-fade-up',
                diff > 0 ? 'text-yellow-600' : 'text-[#f45732]',
              )}
              onAnimationEnd={() => {
                setDiffs((d) => d.filter(([x]) => x !== id))
              }}>
              {diff > 0 ? '+' : ''}
              {diff}
            </span>
          ))}
        </ScoreDisplay>
        <ScoreDisplay name='best' value={best} />
      </aside>
    )
  },
)

Score.displayName = 'Score'

type ScoreDisplayProps = React.ComponentProps<'p'> & {
  name: string
  value: number
}

function ScoreDisplay({
  name,
  value,
  className,
  children,
  ...props
}: ScoreDisplayProps) {
  return (
    <p
      className={clsx(
        'vlg:flex-col flex items-center justify-between',
        'gap-x-2 px-4 py-2 sm:py-1',
        'w-full rounded-xl uppercase',
        'bg-[#eae7d9] text-[#988876]',
        'border-2 border-[#eae7d9] sm:rounded-2xl',
        className,
      )}
      {...props}>
      <span aria-hidden className='text-xs font-medium sm:font-bold'>
        {name}
      </span>
      <output
        className='relative font-bold sm:text-xl sm:font-black'
        aria-live='polite'>
        <span className='sr-only'>{name}: </span>
        {typeof value === 'number' ? value : ' '}
        {children}
      </output>
    </p>
  )
}
