import { MusicNote } from 'src/assets'
import type { SVGIcon } from 'src/lib/types'

type InstrumentConfig = {
  label: string
  Icon: SVGIcon
  /**
   * Audio files keyed by the recorded frequency of each file,
   * used as the resampling base (and free tuning correction).
   */
  samples: Record<number, string>
  /**
   * Octaves to shift the sounding pitch up, for instruments
   * whose natural register sits above the kalimba's.
   * The tine layout and note names are unaffected.
   */
  shift?: number
}

/**
 * Indexed by the `instrumentSound` option.
 */
export const instruments: InstrumentConfig[] = [
  {
    label: 'kalimba',
    Icon: MusicNote,
    samples: { 261.1: '/sounds/music/Kalimba262.ogg' },
  },
  {
    label: 'marimba',
    Icon: MusicNote,
    samples: {
      262: '/sounds/music/Marimba262.ogg',
      521: '/sounds/music/Marimba521.ogg',
      1047: '/sounds/music/Marimba1047.ogg',
    },
  },
  {
    label: 'piano',
    Icon: MusicNote,
    samples: {
      262: '/sounds/music/Piano262.ogg',
      523: '/sounds/music/Piano523.ogg',
      1048: '/sounds/music/Piano1048.ogg',
    },
  },
  {
    label: 'xylophone',
    Icon: MusicNote,
    samples: {
      527: '/sounds/music/Xylophone527.ogg',
      1056: '/sounds/music/Xylophone1056.ogg',
      2113: '/sounds/music/Xylophone2113.ogg',
    },
    shift: 1,
  },
  {
    label: 'music box',
    Icon: MusicNote,
    samples: {
      519: '/sounds/music/MusicBox519.ogg',
      1034: '/sounds/music/MusicBox1034.ogg',
      2082: '/sounds/music/MusicBox2082.ogg',
    },
    shift: 1,
  },
  {
    label: 'harp',
    Icon: MusicNote,
    samples: {
      260: '/sounds/music/Harp260.ogg',
      520: '/sounds/music/Harp520.ogg',
      1042: '/sounds/music/Harp1042.ogg',
    },
  },
  {
    label: 'recorder',
    Icon: MusicNote,
    samples: {
      588: '/sounds/music/Recorder588.ogg',
      1050: '/sounds/music/Recorder1050.ogg',
      1573: '/sounds/music/Recorder1573.ogg',
    },
    shift: 1,
  },
  {
    label: 'triangle',
    Icon: MusicNote,
    samples: {
      261: '/sounds/music/Triangle261.ogg',
      523: '/sounds/music/Triangle523.ogg',
      1046: '/sounds/music/Triangle1046.ogg',
    },
  },
  {
    label: 'sine',
    Icon: MusicNote,
    samples: {
      261: '/sounds/music/Sine261.ogg',
      524: '/sounds/music/Sine524.ogg',
      1046: '/sounds/music/Sine1046.ogg',
    },
  },
  {
    label: 'synth',
    Icon: MusicNote,
    samples: {
      264: '/sounds/music/Synth264.ogg',
      527: '/sounds/music/Synth527.ogg',
      1047: '/sounds/music/Synth1047.ogg',
    },
  },
]
