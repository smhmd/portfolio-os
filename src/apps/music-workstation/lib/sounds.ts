export function kick(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.setValueAtTime(150, time)
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.1)
  gain.gain.setValueAtTime(1, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(time)
  osc.stop(time + 0.1)
}

export function snare(ctx: AudioContext, time: number) {
  const noise = ctx.createBufferSource()
  const noiseGain = ctx.createGain()
  const osc = ctx.createOscillator()
  const oscGain = ctx.createGain()

  const bufferSize = ctx.sampleRate * 0.1
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noise.buffer = buffer
  noiseGain.gain.setValueAtTime(1, time)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

  osc.frequency.setValueAtTime(250, time)
  oscGain.gain.setValueAtTime(1, time)
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

  noise.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)

  noise.start(time)
  osc.start(time)
  osc.stop(time + 0.1)
}

export function hiHat(ctx: AudioContext, time: number) {
  const noise = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  const bufferSize = ctx.sampleRate * 0.05
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  filter.type = 'highpass'
  filter.frequency.setValueAtTime(7000, time)
  gain.gain.setValueAtTime(0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)

  noise.buffer = buffer
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  noise.start(time)
}

export function clap(ctx: AudioContext, time: number) {
  const noise = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  const bufferSize = ctx.sampleRate * 0.1
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(1000, time)
  filter.Q.setValueAtTime(1.0, time)

  gain.gain.setValueAtTime(0, time)
  gain.gain.linearRampToValueAtTime(1, time + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

  noise.buffer = buffer
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  noise.start(time)
}

export function tom(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.frequency.setValueAtTime(100, time)
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.1)

  gain.gain.setValueAtTime(1, time)
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(time)
  osc.stop(time + 0.1)
}
