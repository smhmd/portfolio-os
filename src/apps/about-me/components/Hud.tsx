import { type ReactNode, useEffect, useState } from 'react'

import clsx from 'clsx'

import { isMobile } from 'src/lib/env'

import { dialogue } from '../lib/dialogue'
import { api, store } from '../lib/store'

// The centre-screen prompt treatment, shared by every hint strip.
const strip =
  'bg-gradient-to-r from-transparent via-black/60 to-transparent px-10 py-1 font-serif text-sm tracking-wide text-white'

/**
 * Everything 2D, layered over the canvas and pointer-events-none — so no
 * HUD click can ever engage pointer lock. Also owns the keyboard: space
 * skips, 1–9 pick the matching choice row (they're numbered on screen).
 */
export function Hud() {
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const sync = () => setLocked(document.pointerLockElement != null)
    document.addEventListener('pointerlockchange', sync)
    return () => document.removeEventListener('pointerlockchange', sync)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const controller = new AbortController()

    window.addEventListener(
      'keydown',
      (e) => {
        if (e.repeat || !document.pointerLockElement) return

        if (e.code === 'Space') {
          e.preventDefault()
          return api.skip()
        }

        // number keys mirror the badges on the choice rows
        const i = Number(e.key) - 1
        if (i >= 0 && i < 9) {
          const { node, speaking } = store.get()
          if (speaking) return
          const next = Object.values(dialogue[node].choices ?? {})[i]
          if (next) api.goto(next)
        }
      },
      { signal: controller.signal },
    )
    return () => controller.abort()
  }, [])

  return (
    <>
      <div
        aria-hidden
        className='pointer-events-none fixed inset-0 z-50 size-full'
        style={{ filter: `url(#vignette)` }}
      />

      {!isMobile && <Crosshair locked={locked} />}
      <Subtitles />
      <Hints locked={locked} />
    </>
  )
}

/**
 * Dot reticle. It blooms a ring over anything interactable, and while
 * Simo is talkable the action is spelled out beneath it — the classic
 * centre-screen interaction prompt.
 */
function Crosshair({ locked }: { locked: boolean }) {
  const focus = store.use((s) => s.focus)
  const node = store.use((s) => s.node)

  return (
    <div
      className={clsx(
        'pointer-events-none fixed inset-0 grid place-items-center',
        'transition-opacity duration-200',
        locked ? 'opacity-100' : 'opacity-0',
      )}>
      <div className='relative grid place-items-center'>
        <span className='size-0.75 rounded-full bg-white' />
        <span
          className={clsx(
            'absolute rounded-full border border-white',
            'transition-all duration-200 ease-out',
            focus ? 'size-6 opacity-100' : 'size-2 opacity-0',
          )}
        />
      </div>

      {node === 'start' && (
        <span
          className={clsx(
            strip,
            'absolute top-1/2 mt-8 transition-opacity duration-200',
            focus ? 'opacity-100' : 'opacity-0',
          )}>
          Click to talk
        </span>
      )}
    </div>
  )
}

/** Simo's line as game subtitles: bottom-centre over a soft scrim. */
function Subtitles() {
  const node = store.use((s) => s.node)
  const { text } = dialogue[node]

  return (
    <>
      <div
        className={clsx(
          'pointer-events-none fixed inset-x-0 bottom-0 z-30 h-48',
          'bg-linear-to-t from-black/55 to-transparent',
          'transition-opacity duration-500',
          text ? 'opacity-100' : 'opacity-0',
        )}
      />

      {text && (
        <div className='pointer-events-none fixed inset-x-0 bottom-14 z-40 flex justify-center px-6'>
          <div
            key={node} // remounts per line, so the enter transition replays
            className='starting:translate-y-1 starting:opacity-0 max-w-2xl text-center transition-all duration-300 ease-out'>
            <span className='text-shadow block font-serif text-sm uppercase tracking-[0.35em] text-amber-300/90'>
              Simo
            </span>
            <p className='mt-1 font-serif text-lg leading-snug text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]'>
              {text}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

/** Contextual controls, kept to whispers in the margins. */
function Hints({ locked }: { locked: boolean }) {
  const node = store.use((s) => s.node)
  const speaking = store.use((s) => s.speaking)

  if (isMobile)
    return (
      <>
        {node === 'start' && (
          <div className='pointer-events-none fixed inset-x-0 bottom-5 z-40 grid place-items-center'>
            <span className={strip}>
              Drag to look around — tap Simo to talk
            </span>
          </div>
        )}

        {speaking && (
          <button
            onClick={api.skip}
            className='fixed bottom-4 right-4 z-40 rounded bg-black/40 px-3 py-1.5 font-serif text-sm text-white/80 active:text-amber-300'>
            Skip ›
          </button>
        )}
      </>
    )

  return (
    <>
      {!locked && (
        <div className='pointer-events-none fixed inset-x-0 bottom-5 z-40 grid place-items-center'>
          <span className={strip}>Click to look around</span>
        </div>
      )}

      <div
        className={clsx(
          'pointer-events-none fixed right-4 top-4 z-40 flex flex-col items-end gap-1.5',
          'font-serif text-xs text-white/60 transition-opacity duration-300',
          locked ? 'opacity-100' : 'opacity-0',
        )}>
        <Hint keycap='esc'>exit</Hint>
        {speaking && <Hint keycap='space'>skip</Hint>}
      </div>
    </>
  )
}

function Hint({ keycap, children }: { keycap: string; children: ReactNode }) {
  return (
    <span className='drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'>
      <kbd className='rounded border border-white/25 bg-black/30 px-1.5 py-px font-serif text-[10px] uppercase tracking-wider'>
        {keycap}
      </kbd>{' '}
      {children}
    </span>
  )
}
