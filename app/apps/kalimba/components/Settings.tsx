import clsx from 'clsx'
import { Dialog } from 'radix-ui'

import { ArrowDown } from 'app/assets'

import {
  colors,
  labels,
  MAX_COUNT,
  MIN_COUNT,
  tunings,
  useInstrument,
  useOptions,
} from '../lib'
import { Halo, MenuIcon } from './Icons'
import { NumberPicker } from './NumberPicker'
import { StylePicker } from './StylePicker'
import { TextPicker } from './TextPicker'

function Controls() {
  const { options, setOption } = useOptions()
  const { playNote } = useInstrument()

  return (
    <ul className='flex grid-cols-[1fr_auto] flex-col'>
      <StylePicker
        name='color'
        options={colors}
        value={options.color}
        onValueChange={(value) => {
          setOption({ option: 'color', value: Number(value) })
        }}
      />
      <TextPicker
        name='label type'
        options={labels}
        value={options.labelType}
        onValueChange={(value) => {
          setOption({ option: 'labelType', value: Number(value) })
        }}
      />
      <NumberPicker
        name='tines'
        min={MIN_COUNT}
        max={MAX_COUNT}
        value={options.tines}
        onValueCommit={([value]) => setOption({ option: 'tines', value })}
      />
      <NumberPicker
        name='tuning'
        min={0}
        max={11}
        value={options.tuning}
        formatValue={(value) => tunings[value]}
        onValueChange={([value]) => {
          const octave = value < 4 ? 3 : 4
          playNote({ note: tunings[value], index: -1, octave })
        }}
        onValueCommit={([value]) => setOption({ option: 'tuning', value })}
      />
      <NumberPicker
        name='reverb'
        min={0}
        max={100}
        step={10}
        value={options.reverb}
        formatValue={(value) => `${value}%`}
        onValueCommit={([value]) => setOption({ option: 'reverb', value })}
      />
    </ul>
  )
}

export function Settings() {
  const { options } = useOptions()
  return (
    <Dialog.Root>
      <Dialog.Trigger className='group relative cursor-pointer outline-none'>
        <Halo className='group-active:translate-y-[4px]' />
        <MenuIcon className='size-12 xl:size-24' />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          className={clsx(
            'fixed inset-0 z-10 flex flex-col outline-none',
            'font-quicksand text-white!',
            'data-[state=open]:animate-slide-up data-[state=closed]:animate-slide-down',
            colors[options.color],
          )}>
          <header className='relative flex items-center bg-[#111]/95'>
            <Dialog.Close
              className='absolute inset-0 cursor-pointer outline-none'
              aria-label='Close settings'
              title='Close'
            />
            <ArrowDown className='size-13 mx-2.5 my-3 fill-white' aria-hidden />
            <Dialog.Title className='text-3xl font-semibold'>
              Settings
            </Dialog.Title>
          </header>
          <Dialog.Description className='sr-only'>
            Edit sound and interface preferences.
          </Dialog.Description>
          <section className='bg-[#111]/98 flex grow flex-col overflow-y-auto text-2xl tracking-wide outline-none'>
            <Controls />
            <footer className='mb-4 flex grow items-end justify-center text-lg'>
              Designed by dvdfu
            </footer>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
