import type { Sprite } from './voice'

/**
 * The dialogue graph, flat and JSON-like — one node per line Simo says.
 * (Formerly `script.ts`: in a game codebase "script" reads as *code*;
 * this is data, and the rest of the app already calls the current entry
 * `node`.)
 *
 *   text       what he says (subtitled)
 *   sprite     [start, end] of its audio inside the voice sheet, in seconds
 *   auto       node that follows automatically when the audio ends
 *   choices    prompt shown to the visitor → node it leads to
 *   animation  one-shot gesture Simo plays on entering the node (see Simo)
 *
 * Adding dialogue = adding an entry here, nothing else.
 */

export type NodeId =
  | 'start'
  | 'greeting'
  | 'open_question'
  | 'origin_answer'
  | 'outside_answer'
  | 'reading_answer'
  | 'next_answer'

export type DialogueNode = {
  text: string
  sprite?: Sprite
  auto?: NodeId
  animation?: string
  choices?: Record<string, NodeId>
}

export const dialogue: Record<NodeId, DialogueNode> = {
  start: {
    text: '',
    choices: { 'Hello there.': 'greeting' },
  },

  greeting: {
    text: "Hey, I'm Simo. A software engineer from Morocco. Glad you stopped by.",
    sprite: [0, 7.3],
    auto: 'open_question',
    // was on `start`, where it played behind the splash before anyone
    // could see it — now it greets the click that starts the conversation
    animation: 'agreeing',
  },

  open_question: {
    text: 'What would you like to know?',
    sprite: [7.3, 10.2],
    choices: {
      'How did you get into software?': 'origin_answer',
      'What do you do outside of work?': 'outside_answer',
      'What are you looking for next?': 'next_answer',
    },
  },

  origin_answer: {
    text: 'I wanted to build something for myself and I just kept learning past my need at the time. I ended up joining my local programming club and started giving talks. It was natural for me to go into software.',
    sprite: [10.2, 27],
    choices: {
      'What do you do outside of work?': 'outside_answer',
      'What are you looking for next?': 'next_answer',
    },
  },

  outside_answer: {
    text: 'I read a lot, mostly fantasy. I love hiking and camping in nature. And once in a while, we do board games night with family and friends.',
    sprite: [27, 40.6],
    choices: {
      'What do you read?': 'reading_answer',
      'What are you looking for next?': 'next_answer',
    },
  },

  reading_answer: {
    text: 'I am a huge Terry Pratchett fan. And I also love the A Song of Ice and Fire series, and Dante Alighieri.',
    sprite: [40.6, 49],
    choices: {
      'What are you looking for next?': 'next_answer',
      'How did you get into software?': 'origin_answer',
    },
  },

  next_answer: {
    text: 'An interesting company.',
    sprite: [49, 52.5],
    choices: {
      'How did you get into software?': 'origin_answer',
      'What do you do outside of work?': 'outside_answer',
    },
  },
}

/** Where looking at Simo and clicking "talk" leads. */
export const OPENER = Object.values(dialogue.start.choices!)[0]
