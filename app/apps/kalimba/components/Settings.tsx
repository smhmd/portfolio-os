import React from 'react'

import clsx from 'clsx'
import { Dialog, RadioGroup, Slider } from 'radix-ui'

import { ArrowDown, Close } from '~/assets'
import type { Props } from '~/lib'

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
      <Range
        name='tines'
        min={MIN_COUNT}
        max={MAX_COUNT}
        value={options.tines}
        onValueChange={([value]) => {
          setOption({ option: 'tines', value })
        }}
      />
      <Range
        name='tuning'
        min={0}
        max={11}
        value={options.tuning}
        formatValue={(value) => tunings[value]}
        onValueChange={([value]) => {
          const octave = value < 4 ? 3 : 4
          playNote({ note: tunings[value], index: -1, octave })
          setOption({ option: 'tuning', value })
        }}
      />
      <Range
        name='reverb'
        min={0}
        max={100}
        step={10}
        value={options.reverb}
        formatValue={(value) => `${value}%`}
        onValueChange={([value]) => {
          setOption({ option: 'reverb', value })
        }}
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

type ControlProps = Props<'span', { name: string; value?: string | number }>

function Control({ name, value = '', children, ...props }: ControlProps) {
  return (
    <li className='w-full'>
      <Dialog.Root>
        <Dialog.Trigger
          className={clsx(
            'group flex w-full items-center justify-between',
            'active:bg-white/3 hover:bg-white/2 cursor-pointer',
            'focus-visible:bg-white/2 px-6 py-3 outline-none',
          )}>
          <span className='w-full text-left capitalize tracking-wider'>
            {name}
          </span>
          <span className='flex size-12 shrink-0 items-center justify-center whitespace-pre font-semibold'>
            <span {...props}>{value}</span>
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className={clsx(
              'fixed inset-0 z-20 bg-black/60',
              'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
            )}
          />
          <Dialog.Content
            className={clsx(
              'rounded-4xl fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-[34rem] bg-neutral-900',
              'font-quicksand text-2.5xl tracking-wider outline-none',
              'data-[state=open]:animate-grow-in data-[state=closed]:animate-grow-out',
            )}>
            <section className='pt-5.5 relative flex flex-col gap-y-14 px-8 pb-10'>
              <Dialog.Title className='text-center capitalize'>
                {name}
              </Dialog.Title>
              <Dialog.Description className='sr-only'>
                TODO: FILL THIS DEPENDING ON INPUT TYPE
              </Dialog.Description>
              {children}
              <Dialog.Close
                aria-label='Close'
                className={clsx(
                  'absolute right-4 top-4 cursor-pointer rounded-full p-2',
                  'outline-none',
                  'hover:rotate-90 hover:bg-white/20 focus-visible:rotate-90 focus-visible:bg-white/20',
                  'transition-all duration-300',
                )}>
                <Close className='size-10 fill-current' aria-hidden />
              </Dialog.Close>
            </section>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </li>
  )
}

type PickerProps = Props<
  typeof RadioGroup.Root,
  { options: string[]; name: string; value: number }
>

function TextPicker({ name, value, options, ...props }: PickerProps) {
  return (
    <Control name={name} value={options[value]}>
      <RadioGroup.Root
        defaultValue={value.toString()}
        className='flex justify-center gap-2.5'
        {...props}>
        {options.map((text, i) => (
          <RadioGroup.Item key={text} value={i.toString()} asChild>
            <Token>{text}</Token>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Control>
  )
}

type ColorPickerProps = Props<
  typeof RadioGroup.Root,
  { options: string[]; name: string; value: number }
>

function StylePicker({ name, value, options, ...props }: ColorPickerProps) {
  return (
    <Control
      name={name}
      className={clsx('block size-full rounded-full', options[value])}>
      <RadioGroup.Root
        defaultValue={value.toString()}
        className='grid grid-cols-6 grid-rows-3 gap-2.5'
        {...props}>
        {options.map((color, i) => (
          <RadioGroup.Item
            key={color}
            value={i.toString()}
            aria-label={color}
            asChild>
            <Token className={color} />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Control>
  )
}

type TokenProps = Props<'button'>

function Token({
  className = 'bg-neutral-800',
  children,
  ...props
}: TokenProps) {
  return (
    <button
      className={clsx(
        'size-17 group cursor-pointer rounded-full',
        'relative outline-none',
        'bg-white',
      )}
      {...props}>
      <span className='absolute -inset-1' />
      <span
        className={clsx(
          'absolute -inset-px flex items-center justify-center whitespace-pre leading-7',
          'block rounded-full capitalize',
          'group-active:scale-70 transition-transform',
          'group-data-[state=checked]:scale-80',
          className,
        )}>
        {children}
      </span>
    </button>
  )
}

type RangeProps = Props<
  typeof Slider.Root,
  { value: number; name: string; formatValue?(value: number): number | string }
>

function Range({ name, value, formatValue = (v) => v, ...props }: RangeProps) {
  return (
    <Control name={name} value={formatValue(value)}>
      <div className='flex items-center justify-center gap-x-4'>
        <Slider.Root
          className='group relative flex h-6 grow touch-none items-center justify-between'
          defaultValue={[value]}
          {...props}>
          <Slider.Track className='h-6.5 relative grow rounded-full bg-white/30' />
          <Slider.Thumb
            autoFocus
            id={`slider-${name}`}
            className={clsx(
              'size-13 relative block rounded-full bg-white',
              'shadow-inner-xl shadow-neutral-400',
              'cursor-grab active:cursor-grabbing',
              'hover:shadow-none focus:outline-none group-focus-within:shadow-none',
            )}
            aria-label='Volume'
          />
        </Slider.Root>
        <output
          htmlFor={`slider-${name}`}
          className='mb-0.75 min-w-[4.5ch] text-right font-semibold tabular-nums'>
          {formatValue(value)}
        </output>
      </div>
    </Control>
  )
}
