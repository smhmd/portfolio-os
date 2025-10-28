import { memo, useEffect, useReducer, useState } from 'react'

import clsx from 'clsx'
import { Checkbox } from 'radix-ui'

import { Check } from 'app/assets'

import { FILE_LIMIT, formatBytes } from '../lib'
import { Alert } from './Alert'

type File = {
  length: number
  path: string[]
}

type FileSelectorProps = {
  files: File[]
  onChange: (indexes: Set<number>) => void
}

export const FileSelector = memo(({ files, onChange }: FileSelectorProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState(new Set<number>())
  const [isOverLimit, bypassLimit] = useReducer(
    () => false,
    files.length > FILE_LIMIT,
  )

  useEffect(() => {
    onChange(selectedIndexes)
  }, [selectedIndexes])

  const isFullySelected = selectedIndexes.size === files.length

  function toggleFile(index: number) {
    if (isOverLimit) return

    setSelectedIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function toggleAll() {
    if (isOverLimit) return

    setSelectedIndexes((prev) =>
      prev.size === files.length ? new Set() : new Set(files.map((_, i) => i)),
    )
  }

  const filesCount = files.length.toLocaleString()

  return (
    <fieldset
      className={clsx(
        'animate-fade-in flex flex-col',
        isOverLimit && 'gap-y-2',
      )}>
      <div className='flex items-center justify-between gap-y-1'>
        <legend>
          <h3 className='inline text-xs font-medium text-purple-200'>Files </h3>
          <p
            className='text-xxs inline text-purple-300'
            aria-label={`${filesCount} files`}>
            ({filesCount} files)
          </p>
        </legend>
        {!isOverLimit && (
          <button
            onClick={toggleAll}
            className={clsx(
              'cursor-pointer text-xs text-purple-300 transition-colors hover:text-purple-200',
              '-mr-2 rounded-xl px-2 py-1 outline-none focus-visible:ring',
            )}>
            {isFullySelected ? 'Deselect All' : 'Select All'}
            <span className='sr-only'> files</span>
          </button>
        )}
      </div>
      {isOverLimit ? (
        <Alert
          severity='warning'
          message={`File selection is disabled for torrents with more than ${FILE_LIMIT.toLocaleString()} files.`}
          action={{
            label: 'Open Anyway',
            handler: bypassLimit,
          }}
        />
      ) : (
        <ul
          className='max-h-24 space-y-1 overflow-y-auto'
          aria-label='Select files to include in the magnet link'>
          {files.map((file, index) => {
            const isSelected = selectedIndexes.has(index)
            if (!file.path) return null
            const filePath = file.path.join('/')
            const bytes = formatBytes(file.length)

            return (
              <li key={index}>
                <label
                  className={clsx(
                    'relative flex w-full items-center gap-2 overflow-hidden',
                    'cursor-pointer rounded border px-2 py-1.5',
                    'transition-all duration-300',
                    isSelected
                      ? 'border-purple-500/30 bg-purple-500/10 text-purple-100'
                      : 'border-transparent text-purple-300 hover:bg-white/5',
                  )}
                  aria-label={`${filePath} of ${bytes} in size`}>
                  {isSelected && (
                    <div className='shimmer pointer-events-none absolute inset-0' />
                  )}
                  <Checkbox.Root
                    checked={isSelected}
                    onCheckedChange={() => {
                      toggleFile(index)
                    }}
                    className={clsx(
                      'flex size-3.5 items-center justify-center',
                      'rounded border',
                      'transition-all duration-300',
                      'outline-none focus-visible:ring focus-visible:ring-offset-1 focus-visible:ring-offset-purple-800',
                      isSelected
                        ? 'rotate-0 border-purple-500 bg-purple-500'
                        : 'rotate-90 border-purple-400',
                    )}>
                    <Checkbox.Indicator>
                      <Check aria-hidden className='size-2.5 fill-white' />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <div className='w-0 flex-1 text-left' aria-hidden>
                    <div className='truncate text-xs'>{filePath}</div>
                    <div className='text-xxs opacity-60'>{bytes}</div>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </fieldset>
  )
})

FileSelector.displayName = 'FileSelector'
