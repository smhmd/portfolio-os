import { createStore } from 'src/lib/react'

const store = createStore({
  started: false,
  solved: false,
  ended: false,
  start: () => store.set({ started: true }),
  solve: () => store.set({ solved: true }),
  end: () => store.set({ ended: true, solved: false }),
})

export const useGame = store.use
