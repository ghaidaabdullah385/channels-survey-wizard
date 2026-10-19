import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export function FieldError({ id, message }: { id: string; message?: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-1.5 overflow-hidden text-sm font-medium text-destructive"
        >
          <AlertCircle className="size-4 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
