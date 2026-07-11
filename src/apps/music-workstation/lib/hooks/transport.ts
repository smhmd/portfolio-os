import { useEffect, useState } from 'react'

import { audioContext } from 'src/lib/audio'

import type { Sequencer } from '../transport'

/**
 * Own a sequencer's transport for as long as `playing` holds, and follow the
 * sounding index. A lightweight rAF polls the playhead; setState bails on an
 * unchanged index, so the component re-renders on step boundaries, not every
 * frame. Screens mount exactly while on-screen, so mounting = ownership.
 */
export function useTransport(sequencer: Sequencer, playing: boolean) {
  const [head, setHead] = useState(-1)

  useEffect(() => {
    if (!playing) return
    sequencer.start()
    let raf = requestAnimationFrame(function tick() {
      setHead(sequencer.playhead(audioContext.currentTime))
      raf = requestAnimationFrame(tick)
    })
    return () => {
      sequencer.stop()
      cancelAnimationFrame(raf)
      setHead(-1)
    }
  }, [sequencer, playing])

  return head
}
