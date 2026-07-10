import { PI } from 'src/lib/math'

type Position = [number, number, number]

/**
 * The knobs. Constants that only mean something inside one file (viseme
 * weights, the room's CSG dimensions, model paths) stay local to that
 * file — this is for the ones you come back to tune: layout, timing, feel.
 */

// --- world ----------------------------------------------------------------

export const ROOT_SCALE = 1.1
export const ROOT_POSITION: Position = [0, 0.01, -0.5]

export const CAMERA_POSITION: Position = [0, 2.2, -5]
export const CAMERA_FOV = 55
export const CAMERA_TARGET: Position = [0, 2, 0]

// --- Simo -------------------------------------------------------------------

export const SIMO_POSITION: Position = [0, 0, 0]
export const SIMO_SCALE = 1.3

/** Seconds of crossfade into and out of one-shot gesture clips. */
export const GESTURE_FADE = 0.4

/**
 * 0..1 — how far the head is pulled off the idle pose to meet the camera
 * (the idle clip aims slightly to the side). 0 disables the nudge; to
 * remove the behaviour entirely, delete the marked block in Simo.
 */
export const GAZE = 0.35

// --- dialogue panel ---------------------------------------------------------

/** World anchor beside Simo's shoulder; the DOM panel and its hitboxes share it. */
export const PANEL_POSITION: Position = [-1, 1.5, 0]
export const PANEL_YAW = PI // parallel to Simo, facing the player spawn
export const PANEL_HTML_SCALE = 0.15 // drei <Html transform> scale

/**
 * The invisible planes the crosshair and taps actually hit, mirroring the
 * DOM rows (which are fixed-height for exactly this reason — h-11 + mb-1.5
 * = a 50px pitch). Flip DEBUG_HITBOXES on and tune these two until the
 * pink planes cover the rows; they only ever need retuning if the row CSS
 * or PANEL_HTML_SCALE changes.
 */
export const ROW_PITCH = 0.25
export const ROW_SIZE: [width: number, height: number] = [1.5, 0.24]
export const DEBUG_HITBOXES = false
