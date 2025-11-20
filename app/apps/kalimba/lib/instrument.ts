import { audioContext, globalGain } from './audio'

type Sample = { src: string; freq: number }
type Octaves = { min: number; max: number }
type Options = { samples: Sample[]; octaves: Octaves }

const C4 = 261.6255653005986
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  B: 'Cb',
}

const getName = (index: number, octave: number) => {
  return `${NOTES[index]}${octave}`
}

const getFrequency = (index: number, octave: number) => {
  return C4 * Math.pow(2, (index + (octave - 4) * 12) / 12)
}

export class Instrument {
  private notes = new Map<string, AudioBuffer>()

  constructor(private options: Options) {
    this.main()
  }

  private async main() {
    await Promise.all(this.options.samples.map((s) => this.loadAndGenerate(s)))
  }

  private async loadAndGenerate({ src, freq }: Sample) {
    const arrayBuffer = await (await fetch(src)).arrayBuffer()
    const base = await audioContext.decodeAudioData(arrayBuffer)

    const { min, max } = this.options.octaves
    for (let octave = min; octave <= max; octave++) {
      for (let noteIndex = 0; noteIndex < 12; noteIndex++) {
        const name = getName(noteIndex, octave)
        const ratio = getFrequency(noteIndex, octave) / freq
        const buffer = this.resample(base, ratio)
        this.notes.set(name, buffer)

        const flat = SHARP_TO_FLAT[name.slice(0, -1)]
        if (flat) {
          this.notes.set(`${flat}${octave}`, buffer)
        }
      }
    }
  }

  private resample(buffer: AudioBuffer, ratio: number) {
    const length = Math.floor(buffer.length / ratio)
    const resampledBuffer = audioContext.createBuffer(
      buffer.numberOfChannels,
      length,
      buffer.sampleRate,
    )

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const source = buffer.getChannelData(channel)
      const target = resampledBuffer.getChannelData(channel)

      for (let sample = 0; sample < length; sample++) {
        const position = sample * ratio
        const left = position | 0
        const right = Math.min(left + 1, source.length - 1)
        const factor = position - left

        target[sample] = source[left] + (source[right] - source[left]) * factor
      }
    }

    return resampledBuffer
  }

  play(note: string) {
    const buffer = this.notes.get(note)
    if (!buffer) return

    const src = audioContext.createBufferSource()
    src.buffer = buffer
    src.connect(globalGain)
    src.start()
  }
}
