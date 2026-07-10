import { createStore } from 'src/lib/react'

import { createDie, type DieData, type Variant } from '../lib'

type Result = {
  value: number
  x: number
  y: number
  landed: boolean
}

export type Tally = Result & { id: string }

const dice = createStore({
  dice: [] as DieData[],

  add(variant: Variant) {
    dice.set((state) => ({
      dice: [...state.dice, createDie(variant)],
    }))
  },

  remove(id: string) {
    dice.set((state) => ({
      dice: state.dice.filter((die) => die.id !== id),
    }))

    score.set((state) => {
      const { [id]: _, ...results } = state.results
      return { results }
    })
  },

  clear() {
    dice.set({ dice: [] })
    score.set({ results: {} })
  },

  reroll() {
    dice.set((state) => ({
      dice: state.dice.map((die) => createDie(die.variant)),
    }))

    score.set({ results: {} })
  },
})

const score = createStore({
  results: {} as Record<string, Result>,

  settle(id: string, value: number, x: number, y: number) {
    score.set((state) => ({
      results: {
        ...state.results,
        [id]: { value, x, y, landed: false },
      },
    }))
  },

  tally(id: string) {
    score.set((state) => {
      const result = state.results[id]

      if (!result || result.landed) return {}

      const updated = { ...result, landed: true }

      return { results: { ...state.results, [id]: updated } }
    })
  },
})

export const useDice = dice.use
export const useScore = score.use
