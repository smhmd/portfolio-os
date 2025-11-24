import { isServer } from 'app/lib'

import { audioContext, globalGain } from './audio'

type Options = { sample: string; freq: number; min: number; max: number }
type Pitch = (typeof CHROMATIC_SCALE)[number]

const C4 = 261.6255653005986
const SEMITONE_RATIO = Math.pow(2, 1 / 12)
const CHROMATIC_SCALE = [
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
] as const

const ENHARMONIC = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  B: 'Cb',
} as Record<Pitch, string>

/**
 * Generates playable note sounds from a single audio sample.
 * Loads the sample, resamples it to different pitches,
 * and stores the results for quick playback.
 */
export class Instrument {
  private notes = new Map<string, AudioBuffer>()

  constructor(private options: Options) {
    if (isServer) return
    this.load()
  }

  /**
   * Fetches the sample and kicks off resampling.
   */
  private async load() {
    const response = await fetch(this.options.sample)
    const arrayBuffer = await response.arrayBuffer()
    const data = await audioContext.decodeAudioData(arrayBuffer)
    this.generate(data)
  }

  /**
   * Generates resampled buffers for each chromatic note
   * across the configured octave range.
   */
  private generate(data: AudioBuffer) {
    const { freq: base, min, max } = this.options
    const { numberOfChannels, sampleRate, length } = data

    const channels = Array.from({ length: numberOfChannels }, (_, c) =>
      data.getChannelData(c),
    )

    for (let octave = min; octave <= max; octave++) {
      const semitone = (octave - 4) * 12

      for (let i = 0; i < CHROMATIC_SCALE.length; i++) {
        const pitch = CHROMATIC_SCALE[i]
        const name = pitch + octave

        // Frequency of the target note relative to C4
        const freq = C4 * Math.pow(SEMITONE_RATIO, semitone + i)
        const ratio = freq / base

        const buffer = this.resample(
          channels,
          length,
          ratio,
          numberOfChannels,
          sampleRate,
        )

        this.notes.set(name, buffer)

        // Also store enharmonic equivalents (e.g., C# -> Db)
        const flat = ENHARMONIC[pitch]
        if (flat) this.notes.set(flat + octave, buffer)
      }
    }
  }

  /**
   * Resamples the original audio buffer to a new playback speed.
   * Uses linear interpolation to avoid artifacts.
   */
  private resample(
    channels: Float32Array[],
    length: number,
    ratio: number,
    numberOfChannels: number,
    sampleRate: number,
  ) {
    const targetLength = Math.floor(length / ratio)

    /**
     * Avoid invalid or near-zero-length buffers
     * for extremely high playback ratios.
     */
    if (targetLength <= 1) {
      return audioContext.createBuffer(numberOfChannels, 1, sampleRate)
    }

    const output = audioContext.createBuffer(
      numberOfChannels,
      targetLength,
      sampleRate,
    )

    const last = length - 1

    for (let ch = 0; ch < numberOfChannels; ch++) {
      const source = channels[ch]
      const destination = output.getChannelData(ch)

      for (let i = 0; i < targetLength; i++) {
        const pos = i * ratio
        const left = pos | 0 // same as Math.floor, but faster

        if (left >= last) {
          destination[i] = source[last]
        } else {
          const mix = pos - left
          const right = left + 1

          // Linear interpolation between samples
          destination[i] = source[left] + (source[right] - source[left]) * mix
        }
      }
    }

    return output
  }

  /**
   * Plays a note (e.g., play("C#4"))
   */
  play(note: string) {
    const buffer = this.notes.get(note)
    if (!buffer) return

    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(globalGain)
    source.start()
  }
}
