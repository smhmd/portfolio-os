import React from 'react'

import clsx from 'clsx'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <label
      className={clsx(
        'group relative flex items-center',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}>
      <div className='relative'>
        <input
          type='checkbox'
          className='peer sr-only'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={clsx(
            'rounded-full transition-all duration-200',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-purple-800/90',
            'h-4 w-7',
            disabled
              ? 'bg-gray-600'
              : checked
                ? 'bg-purple-500'
                : 'bg-gray-600',
            !disabled && 'group-hover:bg-opacity-80',
          )}
        />
        <div
          className={clsx(
            'absolute top-0.5 rounded-full transition-all duration-200',
            'h-3 w-3',
            disabled ? 'bg-gray-400' : 'bg-white',
            checked ? 'translate-x-3.5' : 'translate-x-0.5',
            !disabled && 'group-hover:shadow-lg',
          )}
        />
      </div>
      <span
        className={clsx(
          'ml-2 select-none',
          'text-xs',
          disabled ? 'text-gray-400' : 'text-purple-200',
        )}>
        {label}
      </span>
    </label>
  )
}
