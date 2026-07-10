import { useProgress } from '@react-three/drei/core/Progress'
import clsx from 'clsx'

export function Splash() {
  const { active, progress } = useProgress()
  // `!active` guards the gap between loader batches, where progress can
  // momentarily read 100 while more assets (the EXR) are still queued.
  const done = !active && progress >= 100

  return (
    <div
      aria-busy={!done}
      className={clsx(
        'fixed inset-0 z-50 grid place-items-center bg-black',
        'transition-opacity duration-700 ease-out',
        done ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}>
      <div
        role='progressbar'
        aria-label='Loading scene'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className='flex w-48 flex-col items-center gap-4'>
        <span className='font-serif text-xs uppercase tracking-[0.4em] text-white/70'>
          Simo
        </span>

        <div className='h-px w-full bg-white/10'>
          <div
            className='h-full bg-white/60 transition-[width] duration-300 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className='font-serif text-sm tabular-nums text-white/40'>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}
