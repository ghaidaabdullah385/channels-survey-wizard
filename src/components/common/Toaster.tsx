import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { useToast } from "@/store/useToast"

export function Toaster() {
  const message = useToast((s) => s.message)

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-48 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex items-center gap-2 rounded-md bg-foreground px-4 py-3 text-sm font-medium text-background shadow-lg"
          >
            <CheckCircle2 className="size-4 text-coral" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
