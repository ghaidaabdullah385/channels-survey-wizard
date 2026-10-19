import { cn } from "@/lib/utils"

type Props = {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

// works in RTL too
export function Toggle({ id, checked, onCheckedChange }: Props) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "size-4 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-4 rtl:-translate-x-4"
        )}
      />
    </button>
  )
}
