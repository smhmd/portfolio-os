/**
 * Plays sprites out of one pre-rendered voice sheet and exposes a
 * `playhead` in sheet-seconds that drives the lip-sync, so mouth shapes
 * can never drift from the audio.
 *
 * Module-level state, no class: there is exactly one voice, one sheet,
 * one output, and nothing here ever needed `this`.
 */

export type Sprite = readonly [start: number, end: number]

const SHEET_URL = '/sounds/generated/output.wav'

// Lazily created so this module is safe to import during SSR.
let ctx: AudioContext | null = null
const context = () => (ctx ??= new AudioContext())

let sheet: AudioBuffer | null = null
let loading: Promise<AudioBuffer> | undefined
let source: AudioBufferSourceNode | null = null
let origin = 0 // ctx time aligned with sheet position 0
let epoch = 0 // invalidates in-flight plays and stale onended callbacks

/** Idempotent; kick this off early so the first line starts instantly. */
function load() {
  return (loading ??= fetch(SHEET_URL)
    .then((r) => r.arrayBuffer())
    .then((data) => context().decodeAudioData(data))
    .then((buffer) => (sheet = buffer)))
}

/**
 * `onended` only fires if the sprite ran to completion — never when it
 * was stopped or superseded. Safe to call before `load()` resolves;
 * playback simply begins once the sheet is decoded.
 */
function play([start, end]: Sprite, onended?: () => void) {
  const token = ++epoch
  halt()
  void context().resume() // the click that got us here is our user gesture

  void load().then(() => {
    if (token !== epoch) return
    source = context().createBufferSource()
    source.buffer = sheet
    source.connect(context().destination)
    source.onended = () => {
      if (token !== epoch) return
      source = null
      onended?.()
    }
    source.start(0, start, end - start)
    origin = context().currentTime - start
  })
}

function stop() {
  epoch++
  halt()
}

/** Sheet playhead in seconds, or null when silent. */
function playhead() {
  return source ? context().currentTime - origin : null
}

function halt() {
  try {
    source?.stop()
  } catch {
    /* already stopped */
  }
  source = null
}

export const voice = { load, play, stop, playhead }
