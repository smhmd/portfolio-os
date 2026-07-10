import { createStore } from 'src/lib/react'

import { dialogue, type NodeId } from './dialogue'
import { voice } from './voice'

/**
 * The entire game state. `focus` is "what a click would do right now":
 * the node id the crosshair (or a tap) leads to, or null. Both the 3D
 * scene and the DOM HUD read from here; only Interact writes `focus`.
 */
export const store = createStore({
  node: 'start' as NodeId,
  speaking: false,
  focus: null as NodeId | null,
})

/** Jump to a node: play its audio, then follow `auto` when it ends. */
function goto(id: NodeId) {
  const line = dialogue[id]
  store.set({ node: id, speaking: line.sprite != null, focus: null })

  if (!line.sprite) return
  voice.play(line.sprite, () => {
    if (store.get().node !== id) return // superseded by a newer goto
    store.set({ speaking: false })
    if (line.auto) goto(line.auto)
  })
}

/** Cut the current line short and land where it would have. */
function skip() {
  if (!store.get().speaking) return
  voice.stop()
  const { auto } = dialogue[store.get().node]
  if (auto) goto(auto)
  else store.set({ speaking: false })
}

export const api = { goto, skip }
