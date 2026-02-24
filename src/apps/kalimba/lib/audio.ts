import { clientOnly } from 'src/lib'

export const audioContext = clientOnly(() => new AudioContext())
export const globalGain = clientOnly(() => {
  const gain = audioContext.createGain()
  gain.gain.value = 0.3
  gain.connect(audioContext.destination)

  return gain
})
