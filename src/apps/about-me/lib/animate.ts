import { useEffect } from 'react'

import { type AnimationAction, type AnimationMixer, LoopOnce } from 'three'

/**
 * Idle runs forever as the base layer. Any other clip name plays once,
 * cross-faded in and out — standard "gesture over idle" setup.
 */

type Actions = Record<string, AnimationAction | null>

const FADE = 0.4

export function useAnimate(
  animation: string,
  actions: Actions,
  mixer: AnimationMixer,
) {
  useEffect(() => {
    const idle = actions.idle
    idle?.play() // no-op if already running

    const clip = actions[animation]
    if (!idle || !clip || clip === idle) return

    clip.reset().setLoop(LoopOnce, 1).crossFadeFrom(idle, FADE, false).play()
    clip.clampWhenFinished = true

    const toIdle = () =>
      void idle.reset().crossFadeFrom(clip, FADE, false).play()

    mixer.addEventListener('finished', toIdle) // only the one-shot ever finishes
    return () => {
      mixer.removeEventListener('finished', toIdle)
      toIdle()
    }
  }, [animation, actions, mixer])
}
