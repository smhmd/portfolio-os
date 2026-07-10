import { audioContext, globalGain } from 'src/lib/audio'
import { clientOnly } from 'src/lib/ssr'

import { reverb } from './reverb'

/**
 * Records audio coming from the app's AudioContext
 * and offers playback and download of the recording.
 */
export class Recorder {
  public url?: string
  public duration?: number

  private audio: HTMLAudioElement
  private recorder: MediaRecorder | null = null
  private recordedChunks: BlobPart[] = []
  private destination: MediaStreamAudioDestinationNode
  private isReady = false

  /**
   * Sets up a recording node and prepares the HTML audio element for playback.
   */
  constructor() {
    this.destination = audioContext?.createMediaStreamDestination()
    globalGain?.connect(this.destination)
    // Also tap the reverb tail so recordings match what's heard.
    reverb?.output.connect(this.destination)

    this.audio = clientOnly(() => new Audio())
    this.isReady = true
  }

  /**
   * Starts recording the audio routed into the destination node.
   */
  record() {
    if (!this?.isReady) return
    this.recordedChunks = []

    this.recorder = new MediaRecorder(this.destination.stream)
    this.recorder.ondataavailable = (e) => this.recordedChunks.push(e.data)
    this.recorder.start()
  }

  /**
   * Stops recording and plays back of the captured audio on a loop.
   * Async. Resolves with `false` if no audio was captured.
   */
  async play() {
    return new Promise<boolean>((resolve) => {
      if (this.recorder && this.recorder.state == 'recording') {
        this.recorder.onstop = () => {
          const type = this.recorder?.mimeType || 'audio/webm'
          const blob = new Blob(this.recordedChunks, { type })
          this.url = URL.createObjectURL(blob)

          this.audio.onloadedmetadata = () => {
            this.duration = this.audio.duration
            this.audio.loop = true
            this.audio.play()
            resolve(true)
          }

          this.audio.src = this.url
        }

        this.recorder.stop()
      } else resolve(false)
    })
  }

  /**
   * Resets everything to default state.
   */
  reset() {
    if (this.url) URL.revokeObjectURL(this.url)

    this.audio.pause()
    this.audio.currentTime = 0
    this.audio.removeAttribute('src')

    this.url = undefined
    this.duration = undefined
    this.recordedChunks = []
    this.recorder = null
  }
}
