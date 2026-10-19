import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BuilderStep } from "@/features/builder/BuilderStep"
import { LivePreview } from "@/features/builder/LivePreview"
import { ReviewStep } from "@/features/review/ReviewStep"
import { SuccessScreen } from "@/features/review/SuccessScreen"
import { SettingsStep } from "@/features/settings/SettingsStep"
import { cn } from "@/lib/utils"
import { useSurvey } from "@/store/useSurvey"
import { Stepper } from "./Stepper"
import { WizardNav } from "./WizardNav"

export function Wizard() {
  const step = useSurvey((s) => s.step)
  const submitted = useSurvey((s) => s.submitted)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  if (submitted) {
    return (
      <div className="grid flex-1 place-items-center overflow-y-auto p-4">
        <SuccessScreen />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
      <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <Stepper />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 sm:px-6",
            step < 3 && "lg:grid-cols-[minmax(0,1fr)_400px]"
          )}
        >
          <div className="mx-auto w-full min-w-0 max-w-3xl">
            {step === 1 && <SettingsStep />}
            {step === 2 && <BuilderStep />}
            {step === 3 && <ReviewStep />}
            <WizardNav />
          </div>

          {step < 3 && (
            <div className="lg:sticky lg:top-36 lg:self-start">
              <LivePreview />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
