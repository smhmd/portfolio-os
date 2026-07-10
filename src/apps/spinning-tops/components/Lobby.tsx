import { useState } from 'react'

import clsx from 'clsx'

import { leaveGame, type Mode } from '../lib'

type LobbyProps = {
  mode: Mode
  roomCode: string | null
}

const glowButton = clsx(
  'pointer-events-auto cursor-none outline-none',
  'transition-[text-shadow] duration-100 ease-in',
  'hover:text-shadow-cyan-glow focus:text-shadow-cyan-glow',
)

/**
 * Waiting room shown while the P2P room exists but the match hasn't
 * started. Host: shows the invite link (click to copy). Guest: shows a
 * joining indicator — the host starts the match automatically once the
 * connection is up, so there's nothing to do here but wait or cancel.
 */
export function Lobby({ mode, roomCode }: LobbyProps) {
  const [copied, setCopied] = useState(false)

  // Only rendered on the client (the machine starts in MAIN_MENU), so
  // window is safe to touch here.
  const link = roomCode
    ? `${window.location.origin}${window.location.pathname}?join=${roomCode}`
    : ''

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link', link) // e.g. non-secure contexts
    }
  }

  return (
    <section
      className={clsx(
        'init:opacity-0 animate-fade-in anim-duration-1000 pointer-events-none',
        'absolute inset-0 flex flex-col items-center justify-center gap-y-6',
        'px-4 text-center text-xl',
      )}>
      {mode === 'host' ? (
        <>
          <span>Invite a Friend</span>
          <button
            onClick={handleCopy}
            title={link}
            className={clsx(
              glowButton,
              'corner-bevel supports-squircle:hover:bg-cyan-200/10 rounded-full',
              'max-w-full truncate border border-cyan-200/20 px-6 py-2 text-sm',
            )}>
            {copied ? 'Link Copied!' : link}
          </button>
          <span aria-live='polite' className='animate-pulse text-sm opacity-70'>
            Waiting for your friend to join…
          </span>
        </>
      ) : (
        <span aria-live='polite' className='animate-pulse'>
          Joining game…
        </span>
      )}

      <button onClick={leaveGame} className={clsx(glowButton, 'text-sm')}>
        Cancel
      </button>
    </section>
  )
}
