import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Send } from "lucide-react"
import { PixelMark } from "@/components/common/PixelMark"
import { useT } from "@/i18n/useT"
import { cn } from "@/lib/utils"

// in ticks (100ms)
const TICK_MS = 100
const Q1_AT = 20
const PICK_AT = 34
const Q2_AT = 40
const CHECK_AT = [52, 58]
const SEND_AT = 66
const DONE_AT = 72
const RESTART_AT = 110

export function SurveyDemo() {
  const t = useT()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((n) => (n + 1) % RESTART_AT), TICK_MS)
    return () => clearInterval(id)
  }, [])

  const title = t("demoTitle")
  const typed = title.slice(0, tick)
  const q1Options = t("demoQ1Options").split("|")
  const q2Options = t("demoQ2Options").split("|")
  const done = tick >= DONE_AT

  return (
    <div aria-hidden="true" className="relative mx-auto hidden w-full max-w-sm lg:block">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -inset-10 rounded-full bg-coral/30 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative h-[460px] overflow-hidden rounded-md bg-card text-card-foreground shadow-2xl shadow-black/40"
      >
        <div className="relative bg-primary px-5 py-5 text-primary-foreground">
          <PixelMark className="absolute end-3 top-3 opacity-80" cell="size-2" />
          <p className="h-7 text-lg font-bold">
            {typed}
            {tick < title.length + 6 && <span className="ms-0.5 inline-block h-5 w-0.5 animate-pulse bg-current align-middle" />}
          </p>
        </div>

        <div className="space-y-6 p-5">
          {tick >= Q1_AT && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-3 text-sm font-semibold">1. {t("demoQ1")}</p>
              {q1Options.map((option, i) => {
                const picked = tick >= PICK_AT && i === 1
                return (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, scale: picked ? [1, 1.04, 1] : 1 }}
                    transition={{ delay: i * 0.15 }}
                    className={cn(
                      "mb-2 flex items-center gap-3 rounded-sm border px-3 py-2 text-sm transition-colors",
                      picked ? "border-coral bg-coral/10" : "border-border"
                    )}
                  >
                    <span className={cn("grid size-4 place-items-center rounded-full border-2", picked ? "border-coral" : "border-input")}>
                      {picked && <span className="size-2 rounded-full bg-coral" />}
                    </span>
                    {option}
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {tick >= Q2_AT && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-3 text-sm font-semibold">2. {t("demoQ2")}</p>
              <div className="flex flex-wrap gap-2">
                {q2Options.map((option, i) => {
                  const checked = tick >= (CHECK_AT[i] ?? Infinity)
                  return (
                    <motion.span
                      key={option}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs font-medium transition-colors",
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      )}
                    >
                      {checked && <Check className="size-3" strokeWidth={3} />}
                      {option}
                    </motion.span>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        {tick >= Q2_AT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: tick >= SEND_AT && !done ? 0.95 : 1 }}
            className={cn(
              "absolute inset-x-5 bottom-5 flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold text-white transition-colors",
              tick >= SEND_AT ? "bg-coral" : "bg-primary"
            )}
          >
            <Send className="size-4 rtl:-scale-x-100" />
            {t("submit")}
          </motion.div>
        )}

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center bg-card/95 backdrop-blur-sm"
            >
              <div className="relative flex flex-col items-center text-center">
                {[[-70, -50], [70, -40], [-60, 50], [80, 40], [0, -80], [-90, 0]].map(([x, y], i) => (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x, y, opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 }}
                    className={cn("absolute top-6 size-3", i % 2 ? "bg-coral" : "bg-primary")}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className="grid size-14 place-items-center rounded-md bg-coral text-white"
                >
                  <Check className="size-7" strokeWidth={3} />
                </motion.div>
                <p className="mt-4 max-w-56 font-bold">{t("successTitle")}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
