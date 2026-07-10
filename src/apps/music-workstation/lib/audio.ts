import { audioContext, globalGain } from 'src/lib/audio'
import { clientOnly } from 'src/lib/ssr'

import { INITIAL } from './common'

// Plucked triangle voice + a fixed convolver reverb send, all built on the
// app's shared AudioContext and routed through globalGain — so the Recorder
// captures everything for free, and we never spawn a second context.

const SEMITONES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

const master = clientOnly(() => {
  const gain = new GainNode(audioContext, { gain: INITIAL.volume })
  gain.connect(globalGain)
  return gain
})

const reverb = clientOnly(() => {
  const convolver = new ConvolverNode(audioContext, {
    buffer: impulseResponse(2, 4),
  })
  const wet = new GainNode(audioContext, { gain: 0.3 })
  convolver.connect(wet).connect(master)
  return convolver
})

/** Exponentially decaying noise burst ≈ a room. */
function impulseResponse(seconds: number, decay: number) {
  const length = audioContext.sampleRate * seconds
  const buffer = audioContext.createBuffer(2, length, audioContext.sampleRate)
  for (const channel of [0, 1]) {
    const data = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay
    }
  }
  return buffer
}

function frequency(note: string) {
  const midi = SEMITONES.indexOf(note.slice(0, -1)) + (+note.slice(-1) + 1) * 12
  return 440 * 2 ** ((midi - 69) / 12)
}

export const audio = {
  /** Plays a note now, or at `when` (AudioContext time) if provided. */
  play(note: string, velocity = 1, when = audioContext.currentTime) {
    if (audioContext.state === 'suspended') void audioContext.resume()

    const osc = new OscillatorNode(audioContext, {
      type: 'triangle',
      frequency: frequency(note),
    })
    const envelope = new GainNode(audioContext, { gain: 0 })
    envelope.gain.setValueAtTime(0.4 * velocity, when)
    envelope.gain.exponentialRampToValueAtTime(0.001, when + 0.6)

    osc.connect(envelope)
    envelope.connect(master) // dry
    envelope.connect(reverb) // wet send
    osc.start(when)
    osc.stop(when + 0.6)
  },

  setVolume(value: number) {
    master.gain.value = value
  },
}
