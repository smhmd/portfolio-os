import { defineSfx } from 'src/lib/sfx'

/**
 * All sounds are synthesized — no audio assets to load. Delete an entry here
 * (and its call site) to remove a sound; flip `sfxSettings.enabled` in
 * `src/lib/sfx.ts` to mute everything.
 *
 * Collision sounds are designed to be played with
 * `{ velocity: 0..1, detune }` so pitch/brightness/volume scale with impact
 * energy and no two hits sound identical.
 */
export const sounds = {
  /** Glitchy cyberpunk data-chirp for menu hover/focus. */
  hover: defineSfx(
    {
      source: { type: 'square', frequency: { start: 2400, end: 3200 } },
      filter: { type: 'bandpass', frequency: 2800, resonance: 9 },
      envelope: { attack: 0.001, decay: 0.04 },
      gain: 0.055,
      effects: [{ type: 'bitcrusher', bits: 5, mix: 0.45 }],
    },
    60,
  ),

  /** Menu click: bitcrushed downward zap + static tick + sub blip. */
  click: defineSfx({
    layers: [
      {
        source: { type: 'noise', color: 'white' },
        filter: { type: 'highpass', frequency: 2600 },
        envelope: { decay: 0.07 },
        gain: 0.3,
      },
      // glitchy confirm zap
      {
        source: { type: 'square', frequency: { start: 1500, end: 340 } },
        filter: { type: 'bandpass', frequency: 1100, resonance: 5 },
        envelope: { attack: 0.001, decay: 0.07 },
        gain: 0.13,
        effects: [{ type: 'bitcrusher', bits: 4, mix: 0.55 }],
      },
      // tiny burst of static
      {
        source: { type: 'noise', color: 'white' },
        filter: { type: 'highpass', frequency: 4500 },
        envelope: { decay: 0.018 },
        gain: 0.05,
      },
      // sub blip for weight
      {
        source: { type: 'sine', frequency: { start: 210, end: 90 } },
        envelope: { decay: 0.06 },
        gain: 0.1,
      },
    ],
  }),

  /**
   * Countdown "3, 2, 1" — F1 start-light beep (~775 Hz), rich and punchy.
   * For the final light, call `sounds.tick({ detune: 700 })` (a fifth up).
   */
  tick: defineSfx({
    layers: [
      // pure beep fundamental
      {
        source: { type: 'sine', frequency: 775 },
        envelope: { attack: 0.001, decay: 0.22 },
        gain: 0.2,
      },
      // rounded square for body/richness
      {
        source: { type: 'square', frequency: 775 },
        filter: { type: 'lowpass', frequency: 2800 },
        envelope: { attack: 0.001, decay: 0.18 },
        gain: 0.12,
      },
      // octave shimmer
      {
        source: { type: 'sine', frequency: 1550 },
        envelope: { attack: 0.001, decay: 0.12 },
        gain: 0.06,
      },
      // short sub thump — the bombast
      {
        source: { type: 'sine', frequency: { start: 120, end: 60 } },
        envelope: { decay: 0.09 },
        gain: 0.14,
      },
    ],
  }),

  /** "Let It Rip!!" — slithery ripcord pull: ratchety zip + rising whine. */
  rip: defineSfx({
    layers: [
      // ratchety zipper teeth
      {
        source: { type: 'noise', color: 'white' },
        filter: { type: 'bandpass', frequency: 2400, resonance: 4 },
        envelope: { attack: 0.01, decay: 0.32 },
        gain: 0.14,
        effects: [{ type: 'bitcrusher', bits: 4, mix: 0.6 }],
      },
      // slithery rising whine — the pull itself
      {
        source: { type: 'sawtooth', frequency: { start: 140, end: 1050 } },
        filter: { type: 'bandpass', frequency: 1500, resonance: 8 },
        envelope: { attack: 0.03, decay: 0.33 },
        gain: 0.1,
        effects: [{ type: 'bitcrusher', bits: 6, mix: 0.3 }],
      },
      // low friction bed
      {
        source: { type: 'noise', color: 'brown' },
        filter: {
          type: 'lowpass',
          frequency: 500,
          envelope: { peak: 1400, decay: 0.3 },
        },
        envelope: { attack: 0.02, decay: 0.3 },
        gain: 0.18,
      },
    ],
  }),

  /** Top-vs-top: gears grinding — crunchy scrape + inharmonic partials. */
  clash: defineSfx(
    {
      layers: [
        // strike transient
        {
          source: { type: 'noise', color: 'white' },
          filter: { type: 'highpass', frequency: 3000 },
          envelope: { decay: 0.03 },
          gain: 0.3,
        },
        // ringing blade partials (inharmonic "ting")
        {
          source: { type: 'triangle', frequency: 2350 },
          filter: { type: 'bandpass', frequency: 2350, resonance: 14 },
          envelope: { decay: 0.3 },
          gain: 0.14,
        },
        {
          source: { type: 'triangle', frequency: 3610 },
          envelope: { decay: 0.22 },
          gain: 0.08,
        },
        // small body thud — it's still a wall
        {
          source: { type: 'sine', frequency: { start: 220, end: 90 } },
          envelope: { decay: 0.1 },
          gain: 0.2,
        },
      ],
    },
    48,
  ),

  /**
   * Top-vs-barrier: swords clashing — sharp strike + ringing blade.
   * Pass `detune` from the call site so repeated rings don't sound identical.
   */
  wall: defineSfx(
    {
      layers: [
        {
          source: { type: 'sine', frequency: { start: 150, end: 55 } },
          envelope: { decay: 0.16 },
          gain: 0.5,
        },
        {
          source: { type: 'noise', color: 'brown' },
          filter: {
            type: 'lowpass',
            frequency: 700,
            envelope: { peak: 2200, decay: 0.1 },
          },
          envelope: { decay: 0.12 },
          gain: 0.45,
        },
      ],
    },
    60,
  ),
}
