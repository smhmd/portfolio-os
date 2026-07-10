import { clamp, rand } from 'src/lib/math'
/**
 * Hit-stop + screen shake state. Written by Battle on impacts, consumed by
 * Scene's ticker. To remove the features entirely: delete this file and the
 * two blocks marked "juice" in Battle.tsx and Scene.tsx.
 */

export const vfx = {
  /** Screen shake: impacts add trauma, amplitude = trauma², decays in Scene. */
  shake: 0,
  /** Hit-stop: physics freeze in ms, counted down by Scene's loop. */
  hitStopMs: 0,
}

/** Register a top-vs-top impact. `energy` is normalized 0..1. */
export function addImpact(energy: number) {
  vfx.shake = clamp(0, vfx.shake + 0.2 + 0.225 * energy, 1)

  // Only heavy hits freeze time, for 30–90ms.
  if (energy > 1.6 && Math.random() < 3 / 5) {
    vfx.hitStopMs = Math.max(vfx.hitStopMs, 30 + 60 * energy + rand(5))
  }
}
