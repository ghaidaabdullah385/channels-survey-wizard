import { cn } from "@/lib/utils"

const PATTERN = [
  "", "", "bg-coral", "",
  "bg-white/25", "", "", "",
  "", "bg-white/25", "bg-white/10", "",
  "", "", "", "bg-coral/60",
]

export function PixelMark({ className, cell = "size-6" }: { className?: string; cell?: string }) {
  return (
    <div aria-hidden="true" className={cn("grid grid-cols-4", className)}>
      {PATTERN.map((color, i) => (
        <span key={i} className={cn(cell, color)} />
      ))}
    </div>
  )
}
