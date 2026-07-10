import { MathUtils, type Mesh, type Object3D } from 'three'

import cues from './rhubarb.json'

/**
 * Rhubarb mouth shapes (A–H, X = rest) mapped to sparse morph-target weights.
 * Timeline lookups use a monotonic cursor instead of scanning the cue list
 * every frame — O(1) while a line plays, one cheap rewind when it changes.
 */

const VISEMES: Record<string, Record<string, number>> = {
  X: {},
  A: { PP: 0.5 },
  B: {
    kk: 0.7,
    mouthSmileLeft: 0.2,
    mouthSmileRight: 0.2,
    cheekSquintLeft: 0.15,
    cheekSquintRight: 0.15,
  },
  C: {
    ih: 1,
    mouthFrownLeft: 0.2,
    mouthFrownRight: 0.2,
    mouthLowerDownLeft: 0.15,
    mouthLowerDownRight: 0.15,
    mouthSmileLeft: 0.1,
    mouthSmileRight: 0.1,
    cheekSquintLeft: 0.2,
    cheekSquintRight: 0.2,
  },
  D: {
    aa: 1,
    jawForward: 1,
    mouthRollLower: 0.1,
    noseSneerLeft: 0.2,
    noseSneerRight: 0.2,
    cheekSquintLeft: 0.3,
    cheekSquintRight: 0.3,
  },
  E: { oh: 1, jawForward: 1, jawOpen: 0.05, mouthRollLower: 0.1 },
  F: {
    ou: 1,
    mouthPucker: 0.5,
    mouthShrugLower: 1,
    jawForward: 0.5,
    jawOpen: 0.1,
    cheekPuff: 0.05,
  },
  G: {
    FF: 1,
    cheekSquintLeft: 0.25,
    cheekSquintRight: 0.25,
    jawOpen: 0.1,
    mouthRollLower: 0.6,
    mouthShrugLower: 0.15,
    mouthShrugUpper: 0.2,
    noseSneerLeft: 0.3,
    noseSneerRight: 0.3,
  },
  H: {
    TH: 1,
    ih: 0.5,
    cheekSquintLeft: 0.2,
    cheekSquintRight: 0.2,
    mouthFrownLeft: 0.15,
    mouthFrownRight: 0.15,
    mouthLowerDownLeft: 0.15,
    mouthLowerDownRight: 0.15,
    mouthSmileLeft: 0.15,
    mouthSmileRight: 0.15,
  },
}

type Cue = { start: number; end: number; value: string }
const timeline = cues as Cue[]

const REST: Record<string, number> = {}
const MOUTH = [...new Set(Object.values(VISEMES).flatMap(Object.keys))]
const EYES = ['eyeBlinkLeft', 'eyeBlinkRight']

let cursor = 0

function visemeAt(time: number) {
  // Rewind when a new sprite jumps backwards in the sheet.
  if (cursor >= timeline.length || time < timeline[cursor].start) cursor = 0
  while (cursor < timeline.length && timeline[cursor].end <= time) cursor++

  const cue = timeline[cursor]
  return cue && time >= cue.start ? (VISEMES[cue.value] ?? REST) : REST
}

export type Face = {
  influences: number[]
  mouth: [name: string, index: number][]
  eyes: number[]
}

/** Index every morphable mesh under `root` once, ahead of the frame loop. */
export function collectFaces(root: Object3D) {
  const faces: Face[] = []

  root.traverse((object) => {
    const { morphTargetDictionary: dict, morphTargetInfluences: influences } =
      object as Mesh
    if (!dict || !influences) return

    faces.push({
      influences,
      mouth: MOUTH.filter((n) => n in dict).map((n) => [n, dict[n]]),
      eyes: EYES.filter((n) => n in dict).map((n) => dict[n]),
    })
  })

  return faces
}

const BLINK = 0.15 // seconds per close→open
const gap = () => 2 + Math.random() * 3 // 2–5s between blinks

/** Self-scheduling blink: feed elapsed seconds, get the eyelid weight (0→1→0). */
export function makeBlink() {
  let next = gap()
  return (t: number) => {
    const since = t - next
    if (since > BLINK) next = t + gap()
    return since > 0 && since < BLINK ? Math.sin((since / BLINK) * Math.PI) : 0
  }
}

/** Ease the mouth toward the viseme at `time` (null = rest); set eyelids to `blink`. */
export function applyFace(
  faces: Face[],
  time: number | null,
  blink: number,
  delta: number,
) {
  const weights = time === null ? REST : visemeAt(time)

  for (const { influences, mouth, eyes } of faces) {
    for (const [name, i] of mouth)
      influences[i] = MathUtils.damp(
        influences[i],
        weights[name] ?? 0,
        20,
        delta,
      )
    for (const i of eyes) influences[i] = blink
  }
}
