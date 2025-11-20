import clsx from 'clsx'
import { Label, Switch } from 'radix-ui'

type ToggleProps = {
  label: string
  checked: boolean
  onChange(checked: boolean): void
  disabled?: boolean
  title?: string
  className?: string
}

export function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <Label.Root
      className={clsx(
        'group relative flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={clsx(
          'relative rounded-full transition-colors',
          'h-4 w-7',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          checked
            ? 'bg-purple-500 data-[disabled]:bg-purple-500/50'
            : 'bg-gray-600 data-[disabled]:bg-gray-600/50',
          'outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-900/60',
        )}>
        <Switch.Thumb
          className={clsx(
            'absolute block rounded-full bg-white',
            'transition-transform',
            'top-0.5 size-3',
            checked ? 'translate-x-3.5' : 'translate-x-0.5',
          )}
        />
      </Switch.Root>
      <span
        className={clsx(
          'text-xs',
          disabled ? 'text-gray-400' : 'text-purple-200',
        )}>
        {label}
      </span>
    </Label.Root>
  )
}
