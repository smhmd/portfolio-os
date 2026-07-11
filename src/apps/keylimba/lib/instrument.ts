import { audioContext, globalGain } from 'src/lib/audio'
import { isServer } from 'src/lib/env'

type Options = { samples: Record<number, string>; shift?: number }

/**
 * The octave range tines can request, across all tunings and counts.
 */
const MIN_OCTAVE = 3
const MAX_OCTAVE = 7
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
 * Generates playable note sounds from a few audio samples.
 * Each octave is assigned to the closest-pitched sample,
 * which is resampled to produce its notes, minimizing
 * pitch-shifting artifacts at the extremities.
 */
export class Instrument {
  private notes = new Map<string, AudioBuffer>()

  constructor(private options: Options) {
    if (isServer) return
    this.load()
  }

  /**
   * Assigns each octave to the sample closest in pitch,
   * then loads each sample independently.
   */
  private load() {
    const { samples, shift = 0 } = this.options
    const freqs = Object.keys(samples).map(Number)

    const octaves = new Map<number, number[]>()

    for (let octave = MIN_OCTAVE; octave <= MAX_OCTAVE; octave++) {
      // Frequency of the octave's sounding C, compared in log space
      const c = C4 * Math.pow(2, octave + shift - 4)
      const closest = freqs.reduce((a, b) =>
        Math.abs(Math.log2(c / a)) <= Math.abs(Math.log2(c / b)) ? a : b,
      )
      octaves.set(closest, [...(octaves.get(closest) ?? []), octave])
    }

    for (const [freq, range] of octaves) {
      this.loadSample(samples[freq], freq, range)
    }
  }

  /**
   * Fetches a sample and kicks off resampling for its octaves.
   */
  private async loadSample(sample: string, freq: number, octaves: number[]) {
    const response = await fetch(sample)
    const arrayBuffer = await response.arrayBuffer()
    const data = await audioContext.decodeAudioData(arrayBuffer)
    this.generate(data, freq, octaves)
  }

  /**
   * Generates resampled buffers for each chromatic note
   * across the given octaves.
   */
  private generate(data: AudioBuffer, base: number, octaves: number[]) {
    const { shift = 0 } = this.options
    const { numberOfChannels, sampleRate, length } = data

    const channels = Array.from({ length: numberOfChannels }, (_, c) =>
      data.getChannelData(c),
    )

    for (const octave of octaves) {
      // the buffer is stored under the requested name, but the
      // sounding pitch is raised by the configured octave shift
      const semitone = (octave + shift - 4) * 12

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
    if (audioContext.state === 'suspended') audioContext.resume()

    const buffer = this.notes.get(note)
    if (!buffer) return

    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(globalGain)
    source.start()
  }
}
