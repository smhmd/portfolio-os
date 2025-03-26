import { useMemo, useState } from 'react'

import clsx from 'clsx'

import { ArrowDown, Settings } from 'app/assets/svg'
import type { TorrentObject } from 'app/lib/torrent-tools/types'

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
  const [isOpen, setIsOpen] = useState(false)

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
    <div className='mt-2'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'group flex w-full items-center justify-between py-1.5 transition-all duration-300',
          'text-purple-200 hover:text-purple-100',
          'cursor-pointer outline-none',
        )}>
        <div className='flex items-center gap-1.5'>
          <Settings className='size-3.5 fill-purple-300 transition duration-300 group-hover:rotate-180 group-hover:fill-purple-100' />
          <span className='text-sm font-medium'>Advanced Options</span>
        </div>
        <ArrowDown
          className={clsx(
            'size-3.5 fill-current transition duration-300',
            'rounded-full hover:bg-white/10 group-focus-visible:bg-white/10',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0',
        )}>
        <div className='animate-fade-in mt-1 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg bg-white/5 px-3 py-2'>
          <div className='col-span-2 mb-1'>
            <h3 className='text-xs font-medium text-purple-200'>Components</h3>
          </div>

          <div className='space-y-1.5'>
            <Toggle
              label='Include Name'
              checked={options.includeName}
              onChange={(value) =>
                onOptionChange({ option: 'includeName', value })
              }
              disabled={isNameDisabled}
            />
            <Toggle
              label='Include Length'
              checked={options.includeLength}
              onChange={(value) =>
                onOptionChange({ option: 'includeLength', value })
              }
              disabled={isLengthDisabled}
            />
          </div>

          <div className='space-y-1.5'>
            <Toggle
              label='Include Tracker'
              checked={options.includeTracker}
              onChange={(value) =>
                onOptionChange({ option: 'includeTracker', value })
              }
              disabled={isTrackerDisabled}
            />
            {options.includeTracker && (
              <Toggle
                label='Multiple Trackers'
                checked={options.includeMultiTrackers}
                onChange={(value) =>
                  onOptionChange({ option: 'includeMultiTrackers', value })
                }
                disabled={isMultiTrackerDisabled}
              />
            )}
          </div>

          {'files' in torrentObject.info && (
            <div className='col-span-2 mt-2'>
              <FileSelector
                files={torrentObject.info.files}
                onChange={onSelectedFilesChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
