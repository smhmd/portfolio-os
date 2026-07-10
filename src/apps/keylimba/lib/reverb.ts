import { audioContext, globalGain } from 'src/lib/audio'
import { clamp } from 'src/lib/math'
import { clientOnly } from 'src/lib/ssr'

/**
 * Convolution reverb for the master bus.
 *
 * The amount control is a *send*, not a wet/dry crossfade: the original signal
 * always passes through at full level and the reverberant tail is added on top
 * of it. That keeps the attack of every note crisp at any setting, and it means
 * an amount of 0 leaves the sound untouched — this reverb can only ever add,
 * never subtract.
 */
export class Reverb {
  /** Connect sources here. */
  readonly input: GainNode

  /**
   * Route this to the destination, and to any recorder tap so that recordings
   * capture the tail too.
   */
  readonly output: GainNode

  /**
   * Gain on the wet path only — this is the single thing `setAmount` automates.
   * The dry path deliberately has no gain of its own, so it can never be ducked.
   */
  private readonly wet: GainNode

  constructor() {
    this.input = audioContext.createGain()
    this.output = audioContext.createGain()
    this.wet = audioContext.createGain()

    const convolver = audioContext.createConvolver()
    convolver.buffer = this.impulse(2.5, 2)

    // Dry: the input is summed straight into the output, unaltered.
    this.input.connect(this.output)

    // Wet: a parallel copy is folded through the convolver and the wet gain
    // before reaching the same output, so the two paths add rather than replace.
    this.input.connect(convolver).connect(this.wet).connect(this.output)

    // Silent until the app pushes its saved amount in through setAmount(). This
    // is what lets construction happen without changing the existing dry sound.
    this.wet.gain.value = 0
  }

  /**
   * Builds the impulse response the convolver folds every note into.
   *
   * We synthesise one instead of shipping and fetching an audio file. White
   * noise is what produces a dense, natural-sounding tail; fading its amplitude
   * over `seconds` is what makes that tail decay like a real room instead of
   * ringing on forever. Each channel gets its own independent noise, so the left
   * and right tails differ — that decorrelation is what makes the reverb sound
   * wide rather than collapsing to the centre.
   *
   * @param seconds - How long the tail rings out.
   * @param decay - How sharply it fades; larger values die away faster.
   */
  private impulse(seconds: number, decay: number) {
    const { sampleRate } = audioContext
    const length = Math.floor(sampleRate * seconds)
    const buffer = audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const samples = buffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        // Noise in [-1, 1], scaled by an envelope that starts at 1 and curves
        // down to 0 by the end of the buffer.
        samples[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay
      }
    }

    return buffer
  }

  /**
   * Sets how much tail is mixed in, from 0 (none) to 1 (full).
   *
   * The value is ramped over a few milliseconds rather than set instantly,
   * because stepping a gain within a single block produces an audible click.
   * Cancelling any scheduled values and re-anchoring at the current gain first
   * means rapid changes — dragging the slider, say — chain together smoothly
   * instead of fighting one another.
   */
  setValue(amount: number) {
    const value = clamp(0, amount, 1)
    const { gain } = this.wet
    const { currentTime } = audioContext

    gain.cancelScheduledValues(currentTime)
    gain.setValueAtTime(gain.value, currentTime)
    gain.linearRampToValueAtTime(value, currentTime + 0.03)
  }
}

export const reverb = clientOnly(() => {
  const node = new Reverb()
  globalGain.connect(node.input)
  node.output.connect(audioContext.destination)

  return node
})
