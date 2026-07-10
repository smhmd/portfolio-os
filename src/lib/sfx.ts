import type {
  PlayOptions,
  SequenceStep,
  SoundDefinition,
} from '@web-kits/audio'
import {
  defineSequence,
  defineSound,
  ensureReady,
  setMasterVolume,
} from '@web-kits/audio'

import { isClient } from './env'

/**
 * Thin shared wrapper around `@web-kits/audio`.
 *
 * Note: the library manages its own private AudioContext (there is no way to
 * inject one), so this is intentionally separate from `src/lib/audio.ts`.
 * Keep using `audio.ts` for hand-rolled Web Audio; use this module for
 * declarative synthesized SFX. All app code should go through `defineSfx` /
 * `defineSfxSequence` so sounds are uniformly gated, throttled, and
 * SSR/autoplay safe — never import `@web-kits/audio` directly in app code.
 */

/** Global SFX settings. Flip `enabled` to mute every sound at once. */
export const sfxSettings = {
  enabled: true,
  /** Master volume, matching the house default in `audio.ts`. */
  volume: 0.3,
}

let unlocked = false

async function unlock() {
  if (unlocked) return
  unlocked = true // set synchronously so sounds in the same gesture play
  await ensureReady()
  setMasterVolume(sfxSettings.volume)
}

/**
 * Installs one-time listeners that resume the AudioContext on the first user
 * gesture (browser autoplay policy). Call once from an app's provider mount;
 * returns a cleanup function.
 */
export function installSfxUnlock() {
  if (!isClient) return () => {}

  const options = { once: true, capture: true }
  window.addEventListener('pointerdown', unlock, options)
  window.addEventListener('keydown', unlock, options)

  return () => {
    window.removeEventListener('pointerdown', unlock, options)
    window.removeEventListener('keydown', unlock, options)
  }
}

function guard<T extends (opts?: PlayOptions) => unknown>(
  play: T,
  throttleMs = 0,
) {
  let last = -Infinity

  return (opts?: PlayOptions) => {
    if (!isClient || !sfxSettings.enabled || !unlocked) return

    if (throttleMs > 0) {
      const now = performance.now()
      if (now - last < throttleMs) return
      last = now
    }

    play(opts)
  }
}

/**
 * Defines a playable sound. Safe to call at module scope (the underlying
 * library is fully lazy). `throttleMs` caps how often the sound can retrigger,
 * which doubles as a polyphony limit for burst events like collisions.
 */
export function defineSfx(definition: SoundDefinition, throttleMs = 0) {
  return guard(defineSound(definition), throttleMs)
}

/** Defines a short multi-note sequence (e.g. a win/lose stinger). */
export function defineSfxSequence(steps: SequenceStep[]) {
  return guard(defineSequence(steps))
}
