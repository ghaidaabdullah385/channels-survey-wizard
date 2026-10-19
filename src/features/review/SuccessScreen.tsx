import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useT } from "@/i18n/useT"
import { useSurvey } from "@/store/useSurvey"

export function SuccessScreen() {
  const t = useT()
  const reset = useSurvey((s) => s.reset)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center px-4 py-14 text-center"
    >
      <motion.div
        initial={{ scale: 0.3, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
        className="relative mb-8 grid size-20 place-items-center rounded-md bg-coral text-white"
      >
        <Check className="size-10" strokeWidth={3} />
        <span className="absolute -end-4 -top-4 size-5 rounded-sm bg-primary" />
        <span className="absolute -bottom-3 -start-3 size-3 rounded-sm bg-primary/40" />
      </motion.div>

      <h2 ref={headingRef} tabIndex={-1} className="max-w-lg text-balance text-3xl font-bold outline-none">
        {t("successTitle")}
      </h2>
      <p className="mt-3 text-muted-foreground">{t("successText")}</p>

      <Button size="lg" onClick={reset} className="mt-10">
        <Plus />
        {t("newSurvey")}
      </Button>
    </motion.div>
  )
}
