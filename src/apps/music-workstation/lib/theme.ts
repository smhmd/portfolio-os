import type { ParameterId } from './common'

/**
 * The four encoder colors — the one palette shared by the knobs' readouts
 * and every screen's graphics, keyed by the physical knob they belong to.
 * (The knob caps themselves are styled in styles.css; keep these in sync.)
 */
export const COLORS = {
  blue: '#6f87ff',
  brown: '#ab8567',
  gray: '#a8a29e',
  orange: '#d54922',
} as const satisfies Record<ParameterId, string>
