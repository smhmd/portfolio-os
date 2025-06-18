import { useMemo } from 'react'

import clsx from 'clsx'
import { Accordion } from 'radix-ui'

import { ArrowDown, Settings } from 'app/assets'
import type { TorrentObject } from 'app/lib/torrent-tools'

import type { Options } from '../lib'
import { FileSelector } from './FileSelector'
import { Toggle } from './Toggle'

interface AdvancedOptionsProps {
  torrentObject: TorrentObject
  options: Options
  onOptionChange: (payload: { option: keyof Options; value: boolean }) => void
  onSelectedFilesChange: (payload: Set<number>) => void
}

export function AdvancedOptions({
  torrentObject,
  options,
  onOptionChange,
  onSelectedFilesChange,
}: AdvancedOptionsProps) {
  const {
    isNameDisabled,
    isLengthDisabled,
    isTrackerDisabled,
    isMultiTrackerDisabled,
  } = useMemo(() => {
    return {
      isNameDisabled: !torrentObject.info.name,
      isLengthDisabled:
        !('length' in torrentObject.info) && !('files' in torrentObject.info),
      isTrackerDisabled: !torrentObject.announce,
      isMultiTrackerDisabled: !torrentObject['announce-list']?.length,
    }
  }, [torrentObject])

  return (
    <section
      aria-labelledby='advanced-options-heading'
      className='animate-fade-in'>
      <Accordion.Root type='single' collapsible>
        <Accordion.Item
          value='advanced-options'
          className='flex flex-col gap-1'>
          <Accordion.Header>
            <Accordion.Trigger
              className={clsx(
                'group flex w-full items-center justify-between py-1.5 transition-all duration-75',
                'text-purple-300 hover:text-purple-100',
                'cursor-pointer outline-none',
              )}>
              <div className='flex items-center gap-1.5'>
                <Settings
                  aria-hidden
                  className='size-3.5 fill-purple-300 transition duration-300 group-hover:rotate-180 group-hover:fill-purple-100'
                />
                <span
                  id='advanced-options-heading'
                  className='text-xs font-medium'>
                  Advanced Options
                </span>
              </div>
              <ArrowDown
                aria-hidden
                className={clsx(
                  'size-3.5 fill-current transition duration-300',
                  'rounded-full hover:bg-white/10 group-focus-visible:bg-white/10',
                  'ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180',
                )}
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className='animate-accordion overflow-hidden'>
            <div
              className={clsx(
                'animate-fade-in rounded-lg bg-white/5 px-3 py-2',
                'flex flex-col gap-2',
              )}>
              <fieldset className='space-y-2'>
                <legend className='text-xs font-medium text-purple-200'>
                  <span className='sr-only'>
                    Components to include in the magnet URL
                  </span>
                  <span aria-hidden>Components</span>
                </legend>

                <div className='flex flex-wrap justify-between gap-1.5 *:min-w-[140px] sm:grid sm:grid-cols-2 sm:grid-rows-2'>
                  <Toggle
                    label='Include Name'
                    checked={options.includeName}
                    onChange={(value) =>
                      onOptionChange({ option: 'includeName', value })
                    }
                    disabled={isNameDisabled}
                  />
                  <Toggle
                    className='order-1'
                    label='Include Tracker'
                    checked={options.includeTracker}
                    onChange={(value) =>
                      onOptionChange({ option: 'includeTracker', value })
                    }
                    disabled={isTrackerDisabled}
                  />
                  <Toggle
                    label='Include Length'
                    checked={options.includeLength}
                    onChange={(value) =>
                      onOptionChange({ option: 'includeLength', value })
                    }
                    disabled={isLengthDisabled}
                  />
                  {options.includeTracker && (
                    <Toggle
                      className='order-2'
                      label='Multiple Trackers'
                      checked={options.includeMultiTrackers}
                      onChange={(value) =>
                        onOptionChange({
                          option: 'includeMultiTrackers',
                          value,
                        })
                      }
                      disabled={isMultiTrackerDisabled}
                    />
                  )}
                </div>
              </fieldset>

              {'files' in torrentObject.info && (
                <>
                  <FileSelector
                    key={torrentObject.info.name}
                    files={torrentObject.info.files}
                    onChange={onSelectedFilesChange}
                  />
                </>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </section>
  )
}
