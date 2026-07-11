import { audioContext, globalGain } from 'src/lib/audio'
import { clientOnly } from 'src/lib/ssr'

import { INITIAL } from './common'

// Two voices + a fixed convolver reverb send, all built on the app's shared
// AudioContext and routed through globalGain — so the Recorder captures
// everything for free, and we never spawn a second context.
//
//   'string' — Karplus-Strong plucked string, synthesized into a buffer per
//              hit (a native DelayNode feedback loop is clamped to 128
//              samples, which would cap the pitch around F4 — so we run the
//              same algorithm ahead of the clock instead).
//   'pluck'  — twin detuned triangles through a closing lowpass.
//
// Flip VOICE to A/B them by ear.
const VOICE: 'string' | 'pluck' = 'string'

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

/** Shared tail of the voice chain: random narrow stereo → dry + wet send. */
function output() {
  const pan = new StereoPannerNode(audioContext, {
    pan: Math.random() * 0.24 - 0.12,
  })
  pan.connect(master) // dry
  pan.connect(reverb) // wet send
  return pan
}

/**
 * Karplus-Strong: a noise burst circulating through a one-period delay and
 * a two-point average. The averaging rounds off the highs a little every
 * trip, so the tone starts bright and mellows as it rings — for free. Each
 * hit is seeded from fresh noise, so no two are alike.
 */
function pluckedString(f: number, velocity: number) {
  const rate = audioContext.sampleRate
  const period = Math.round(rate / f)
  // Lower notes ring longer, like strings: ~1.7s at F3 down to ~0.9s at E5,
  // with the loop loss tuned to hit -60dB right at the buffer's end.
  const seconds = 2.2 * Math.sqrt(110 / f)
  const loss = 10 ** (-3 / (f * seconds))
  const n = Math.floor(rate * seconds)
  const data = new Float32Array(n)

  // Excitation: one period of noise, lowpassed by (lack of) velocity —
  // soft hits get a duller pick — and centered to keep DC out of the loop.
  const bright = 0.25 + 0.75 * velocity
  let smooth = 0
  let mean = 0
  for (let i = 0; i < period; i++) {
    smooth += bright * (Math.random() * 2 - 1 - smooth)
    data[i] = smooth
    mean += smooth / period
  }
  for (let i = 0; i < period; i++) data[i] -= mean

  for (let i = period; i < n; i++) {
    const j = i - period
    data[i] = loss * 0.5 * (data[j] + data[Math.max(j - 1, 0)])
  }

  const buffer = audioContext.createBuffer(1, n, rate)
  buffer.copyToChannel(data, 0)
  return { buffer, seconds }
}

/** Karplus-Strong voice. */
function playString(f: number, velocity: number, when: number) {
  const { buffer } = pluckedString(f, velocity)
  const source = new AudioBufferSourceNode(audioContext, {
    buffer,
    // A few random cents per note, so hits never sound stamped from a mold.
    playbackRate: 2 ** ((Math.random() * 6 - 3) / 1200),
  })
  const gain = new GainNode(audioContext, { gain: 0.5 * velocity })
  source.connect(gain).connect(output())
  source.start(when)
}

const ATTACK = 0.005 // seconds; a real attack instead of an instant jump (no click)

/** Subtractive voice: twin detuned triangles through a closing lowpass. */
function playPluck(f: number, velocity: number, when: number) {
  // Lower notes ring longer, like strings: ~1.1s at F3 down to ~0.6s at E5.
  const decay = 1.4 * Math.sqrt(110 / f)
  const end = when + decay

  // Two slightly detuned triangles instead of one — plus a few random
  // cents per note, so consecutive hits never sound stamped from a mold.
  const jitter = Math.random() * 6 - 3
  const oscs = [4, -4].map(
    (spread) =>
      new OscillatorNode(audioContext, {
        type: 'triangle',
        frequency: f,
        detune: jitter + spread,
      }),
  )

  // The filter opens with velocity and sweeps closed as the note dies —
  // the timbral movement that keeps the voice from sounding like a beep.
  const filter = new BiquadFilterNode(audioContext, {
    type: 'lowpass',
    Q: 0.8,
  })
  filter.frequency.setValueAtTime(Math.min(f * (2 + 6 * velocity), 12000), when)
  filter.frequency.exponentialRampToValueAtTime(f * 1.25, end)

  const envelope = new GainNode(audioContext, { gain: 0 })
  envelope.gain.setValueAtTime(0, when)
  envelope.gain.linearRampToValueAtTime(0.25 * velocity, when + ATTACK)
  envelope.gain.exponentialRampToValueAtTime(0.001, end)

  for (const osc of oscs) {
    osc.connect(filter)
    osc.start(when)
    osc.stop(end + 0.05)
  }
  filter.connect(envelope).connect(output())
}

export const audio = {
  /** Plays a note now, or at `when` (AudioContext time) if provided. */
  play(note: string, velocity = 1, when = audioContext.currentTime) {
    if (audioContext.state === 'suspended') void audioContext.resume()
    const f = frequency(note)
    if (VOICE === 'string') playString(f, velocity, when)
    else playPluck(f, velocity, when)
  },

  setVolume(value: number) {
    master.gain.value = value
  },
}
