import Matter from 'matter-js'

import { NET_APP_ID, type PlayerID } from './common'
import { actor } from './machine'

const { Vector } = Matter

/**
 * Peer-to-peer transport (Trystero / WebRTC). This is the only file
 * that knows the network exists.
 *
 * Model — host-authoritative mirrored simulation:
 * - Both peers run the exact same physics from the two aim vectors.
 * - Each peer streams its own aim (~30 Hz). The opponent's aim lands in
 *   `net.remoteAim`, the network twin of the local `crosshair` vector.
 * - The host streams body snapshots (~20 Hz); the guest softly corrects
 *   its simulation toward them (`net.snapshot`).
 * - Eliminations are the host's verdict alone. The guest never decides
 *   locally — it reads `net.remoteEliminated` and obeys. This is what
 *   keeps both screens telling the same story.
 * - Match start (first game and every rematch) is relayed off the state
 *   machine itself: whenever the host enters COUNTDOWN, the guest is
 *   told to as well.
 * - A hidden tab can't simulate (the browser stops its game loop), so
 *   each peer announces its visibility and the match pauses for both
 *   while either is away. `friendPaused` lives in the machine context;
 *   the Scene freezes physics on it and the Menu explains it.
 *
 * Gameplay code never touches the network API — it only reads/writes
 * the three buffers below and calls the send functions.
 */

/** [x, y, vx, vy] */
export type BodySnapshot = [number, number, number, number]
export type Snapshot = Record<PlayerID, BodySnapshot>

type Aim = [x: number, y: number]
type Room = ReturnType<typeof import('trystero').joinRoom>

/**
 * A host in a background tab is timer-throttled and the initial WebRTC
 * handshake can stall for good. Periodically rejoining re-announces the
 * guest, and succeeds as soon as the host's tab is active again.
 */
const JOIN_RETRY_MS = 10_000

const noop = () => {}

export const net = {
  /** The opponent's aim — read by <NetBattle> exactly like `crosshair`. */
  remoteAim: Vector.create(0, 0),
  /** Latest authoritative snapshot (guest only), consumed by <NetBattle>. */
  snapshot: null as Snapshot | null,
  /** The host's elimination verdict (guest only), consumed by <NetBattle>. */
  remoteEliminated: null as PlayerID | null,

  sendAim: noop as (aim: Aim) => void,
  sendState: noop as (snapshot: Snapshot) => void,
  sendEliminated: noop as (id: PlayerID) => void,
}

let room: Room | null = null
let opponent: string | null = null
let sendHidden = noop as (hidden: boolean) => void
let stopStartRelay: (() => void) | null = null
let stopVisibility: (() => void) | null = null
let retryTimer: ReturnType<typeof setInterval> | null = null

export async function hostGame() {
  if (room) return

  const code = Math.random().toString(36).slice(2, 8)
  actor.send({ type: 'lobby.host', payload: code })

  const sendStart = await connect(code, () => {
    // First peer in: kick off the match. The relay below carries the
    // resulting COUNTDOWN transition over to them.
    actor.send({ type: 'game.countdown' })
  })

  stopStartRelay = relayMatchStart(sendStart)
  stopVisibility = watchVisibility()
}

export async function joinGame(code: string) {
  if (room) return

  actor.send({ type: 'lobby.join', payload: code })
  await connect(code)

  stopVisibility = watchVisibility()

  retryTimer = setInterval(() => {
    if (opponent || !room) return
    room.leave()
    void connect(code)
  }, JOIN_RETRY_MS)
}

/** Tear the room down and return to the main menu. Safe to call twice. */
export function leaveGame() {
  stopStartRelay?.()
  stopStartRelay = null

  stopVisibility?.()
  stopVisibility = null

  if (retryTimer) clearInterval(retryTimer)
  retryTimer = null

  room?.leave()
  room = null
  opponent = null

  net.snapshot = null
  net.remoteEliminated = null
  net.sendAim = noop
  net.sendState = noop
  net.sendEliminated = noop
  sendHidden = noop

  actor.send({ type: 'net.disconnect' })
}

async function connect(code: string, onOpponentJoin?: () => void) {
  // Dynamic import keeps trystero out of the SSR bundle.
  const { joinRoom } = await import('trystero')

  room = joinRoom({ appId: NET_APP_ID }, code)

  // Actions are named channels; both peers must declare the same set.
  const aim = room.makeAction<Aim>('aim')
  const state = room.makeAction<Snapshot>('state')
  const over = room.makeAction<PlayerID>('over')
  const start = room.makeAction<null>('start')
  const hidden = room.makeAction<boolean>('hidden')

  net.sendAim = (data) => void aim.send(data)
  net.sendState = (data) => void state.send(data)
  net.sendEliminated = (id) => void over.send(id)
  sendHidden = (isHidden) => void hidden.send(isHidden)

  aim.onMessage = ([x, y]) => {
    net.remoteAim.x = x
    net.remoteAim.y = y
  }

  state.onMessage = (snapshot) => {
    net.snapshot = snapshot
  }

  over.onMessage = (id) => {
    net.remoteEliminated = id
  }

  start.onMessage = () => {
    actor.send({ type: 'game.countdown' })
  }

  hidden.onMessage = (isHidden) => {
    actor.send({ type: 'friend.pause', payload: isHidden })
  }

  room.onPeerJoin = (peerId) => {
    if (opponent) return // strictly 1v1 — ignore extra peers
    opponent = peerId

    // Let them know right away if we're already tabbed out.
    if (document.hidden) sendHidden(true)

    onOpponentJoin?.()
  }

  room.onPeerLeave = (peerId) => {
    if (peerId === opponent) leaveGame()
  }

  return () => void start.send(null)
}

/**
 * Announce our tab visibility so the opponent can pause with us. The
 * visibilitychange handler runs synchronously on hide, before the
 * browser throttles the page, so the message reliably gets out.
 */
function watchVisibility() {
  const onChange = () => sendHidden(document.hidden)
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

/**
 * Host only. The machine already models "a match is starting" as the
 * COUNTDOWN transition, so rather than wiring network calls into every
 * button that can start a match (first game, Play Again), we mirror
 * that one transition to the guest.
 */
function relayMatchStart(sendStart: () => void) {
  let last = actor.getSnapshot().value

  const subscription = actor.subscribe((state) => {
    if (state.value !== last && state.matches('COUNTDOWN')) sendStart()
    last = state.value
  })

  return () => subscription.unsubscribe()
}
