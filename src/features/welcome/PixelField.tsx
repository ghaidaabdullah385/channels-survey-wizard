import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const COLORS = ["bg-white/15", "bg-white/10", "bg-coral/70", "bg-white/20"]

const PIXELS = Array.from({ length: 36 }, (_, i) => ({
  top: (i * 37) % 100,
  left: 50 + ((i * 53) % 50),
  size: i % 5 === 0 ? "size-6" : "size-3",
  color: COLORS[i % COLORS.length],
  delay: (i * 0.7) % 6,
}))

export function PixelField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      {PIXELS.map((pixel, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 4, delay: pixel.delay, repeat: Infinity, repeatDelay: 2 }}
          style={{ top: `${pixel.top}%`, insetInlineStart: `${pixel.left}%` }}
          className={cn("absolute", pixel.size, pixel.color)}
        />
      ))}
    </div>
  )
}
