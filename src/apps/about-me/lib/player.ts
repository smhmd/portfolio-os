import { audioContext } from 'src/lib/audio'

export type Sprite = readonly [start: number, end: number]

class Player {
  private buffer: AudioBuffer | null = null
  private loading?: Promise<AudioBuffer>
  private source: AudioBufferSourceNode | null = null
  private origin = 0 // ctx time aligned to sheet position 0 of the playing sprite

  load() {
    return (this.loading ??= fetch('/sounds/generated/output.wav')
      .then((r) => r.arrayBuffer())
      .then((d) => audioContext.decodeAudioData(d))
      .then((b) => (this.buffer = b)))
  }

  play([start, end]: Sprite, onended?: () => void) {
    this.stop()
    void audioContext.resume() // the click that started the chat is our user gesture
    if (!this.buffer) return
    const source = (this.source = audioContext.createBufferSource())
    source.buffer = this.buffer
    source.connect(audioContext.destination)
    source.start(0, start, end - start)
    source.onended = () => {
      if (source !== this.source) return // superseded
      this.source = null
      onended?.()
    }
    this.origin = audioContext.currentTime - start
  }

  stop = () => {
    this.source?.stop()
    this.source = null
  }

  /** Sheet playhead in seconds, or null when silent — drives lip-sync. */
  playhead() {
    return this.source ? audioContext.currentTime - this.origin : null
  }
}

export const player = new Player()
