import { Recorder as AudioRecorder } from 'src/lib/recorder'

import { reverb } from './reverb'

/**
 * Keylimba's recorder: the shared audio Recorder, additionally tapping the
 * app's reverb tail so recordings match what's heard.
 */
export class Recorder extends AudioRecorder {
  constructor() {
    super(reverb?.output)
  }
}
