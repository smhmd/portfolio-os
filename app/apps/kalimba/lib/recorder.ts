import { clientOnly } from 'app/lib'

import { audioContext, globalGain } from './audio'

export class Recorder {
  public url?: string
  public duration?: number

  private audio: HTMLAudioElement
  private recorder: MediaRecorder | null = null
  private recordedChunks: BlobPart[] = []
  private destination: MediaStreamAudioDestinationNode
  private isReady = false

  constructor() {
    this.destination = audioContext?.createMediaStreamDestination()
    globalGain?.connect(this.destination)

    this.audio = clientOnly(() => new Audio())
    this.isReady = true
  }

  record() {
    if (!this?.isReady) return
    this.recordedChunks = []
    const stream = this.destination.stream
    this.recorder = new MediaRecorder(stream)

    this.recorder.ondataavailable = (e) => this.recordedChunks.push(e.data)
    this.recorder.start()
    console.log('🎙️ Recording started')
  }

  async play() {
    return new Promise<boolean>((resolve) => {
      if (this.recorder && this.recorder.state == 'recording') {
        this.recorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' })
          this.url = URL.createObjectURL(blob)
          this.audio.src = this.url

          this.audio.onloadedmetadata = () => {
            this.duration = this.audio.duration
            this.audio.loop = true
            this.audio.play()
            resolve(true)
          }
        }

        this.recorder.stop()
      } else resolve(false)
    })
  }

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
