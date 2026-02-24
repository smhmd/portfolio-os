import type * as T from 'tone'

export let synth: T.Synth
export let destination: ReturnType<typeof T.getDestination>

export const initToneOnClick = async () => {
  if (synth || destination) return
  const T = await import('tone')
  await T.start()
  synth = new T.Synth().toDestination()
  destination = T.getDestination()
}
