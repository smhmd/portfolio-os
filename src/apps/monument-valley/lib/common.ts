export type Position = [number, number, number]

export type IdaAnimation = 'idle' | 'walk'

export const STEP_TIME = 0.6
export const TURN_RATE = 10

export const START_NODE = 3
export const FORK = 13
export const KEY = 29
export const EXIT = 25
export const HINT_TAP = 9
export const HINT_ROTATE = 10
export const GAP_START = 10
export const GAP_END = 12

export const BRANCH_B = new Set([26, 27, 28, 29])
export const BRIDGE = new Set([10, 11, 12, 13, 14, 15, 16, 26, 27, 28])

export const GRAPH = [
  { pos: [-1, 0, 0], next: [1] },
  { pos: [-2, 0, 0], next: [0, 2] },
  { pos: [-3, 0, 0], next: [1, 3] },
  { pos: [-4, 0, 0], next: [2, 4] },
  { pos: [-5, 0, 0], next: [3, 5] },
  { pos: [-6, 0, 0], next: [4, 6] },
  { pos: [-7, 0, 0], next: [5, 7] },
  { pos: [-7, 0, -1], next: [6, 8] },
  { pos: [-7, 0, -2], next: [7, 9] },
  { pos: [-7, 0, -3], next: [8, 10] },
  { pos: [-7, 0, -4], next: [9, 11] },
  { pos: [-7, 0, -5], next: [10, 12] },
  { pos: [-7, 0, -6], next: [11, 13] },

  { pos: [-7, 0, -7], next: [12, 14, 26] }, // FORK. Can go to either branch from here.

  // branch A
  { pos: [-8, 0, -7], next: [13, 15] },
  { pos: [-9, 0, -7], next: [14, 16] },
  { pos: [-10, 0, -7], next: [15, 17] },
  { pos: [-11, 0, -7], next: [16, 18] },
  { pos: [-12, 0, -7], next: [17, 19] },
  { pos: [-13, 0, -7], next: [18, 20] },
  { pos: [-14, 0, -7], next: [19, 21] },
  { pos: [-14, 0, -8], next: [20, 22] },
  { pos: [-14, 0, -9], next: [21, 23] },
  { pos: [-14, 0, -10], next: [22, 24] },
  { pos: [-14, 0, -11], next: [23, 25] },
  { pos: [-14, 0, -12], next: [] }, // FINAL! Linked to, but doesn't link to other nodes.

  // branch B
  { pos: [-7, 0, -8], next: [13, 27] },
  { pos: [-7, 0, -9], next: [26, 28] },
  { pos: [-7, 0, -10], next: [27, 29] },
  { pos: [-7, 0.05, -11], next: [28] }, // Pressure plate. Slightly raised
] as const
