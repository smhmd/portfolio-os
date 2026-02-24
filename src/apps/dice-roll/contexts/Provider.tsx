import React, { useState } from 'react'

import type { RigidBodyProps } from '@react-three/rapier'

import { type Variant, ZOOM } from '../lib'
import { type Dice, DiceContext } from './context'

type DiceProviderProps = React.PropsWithChildren

function randomSpin(): RigidBodyProps {
  return {
    linearVelocity: [
      (Math.random() - 0.5) * 8, // x
      Math.random() * 6 + 12, // y (upward push)
      (Math.random() - 0.5) * 8, // z
    ],
    angularVelocity: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    ],
  }
}

export function DiceProvider({ children }: DiceProviderProps) {
  const [dice, setDice] = useState<Dice[]>([])

  function addDice(variant: Variant) {
    const id = Math.random().toString()
    const dice: Dice = {
      variant,
      position: [0, ZOOM * 0.6, 0],
      ...randomSpin(),
      id,
    }
    setDice((all) => [...all, dice])
  }

  function removeDice(id: string) {
    setDice((dice) => dice.filter((die) => die.id !== id))
  }

  return (
    <DiceContext.Provider value={{ dice, addDice, removeDice }}>
      {children}
    </DiceContext.Provider>
  )
}
