import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useWizard } from "@/hooks/useWizard"
import type { TKey } from "@/i18n/translations"
import { useT } from "@/i18n/useT"
import { cn } from "@/lib/utils"
import type { Step } from "@/store/useSurvey"

const STEPS: { step: Step; label: TKey; hint: TKey }[] = [
  { step: 1, label: "stepSettings", hint: "stepSettingsHint" },
  { step: 2, label: "stepQuestions", hint: "stepQuestionsHint" },
  { step: 3, label: "stepReview", hint: "stepReviewHint" },
]

export function Stepper() {
  const t = useT()
  const { step, goTo } = useWizard()

  return (
    <nav aria-label={t("wizardSteps")}>
      <ol className="grid grid-cols-3 gap-3">
        {STEPS.map((item, i) => {
          const done = item.step < step
          const current = item.step === step

          return (
            <li key={item.step}>
              <button
                type="button"
                onClick={() => goTo(item.step)}
                aria-current={current ? "step" : undefined}
                className="group flex w-full flex-col gap-3 rounded-md text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card"
              >
                <span className="flex w-full items-center gap-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-sm text-sm font-bold transition-colors duration-300",
                      done && "bg-primary text-primary-foreground",
                      current && "bg-coral text-white",
                      !done && !current && "border-2 border-border text-muted-foreground group-hover:border-brand/50"
                    )}
                  >
                    {done ? <Check className="size-4" strokeWidth={3} /> : item.step}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-border">
                      <motion.span
                        className="block h-full bg-primary"
                        initial={false}
                        animate={{ width: done ? "100%" : current ? "35%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </span>
                  )}
                </span>
                <span>
                  <span className={cn("block text-sm font-bold", !current && !done && "text-muted-foreground")}>
                    {t(item.label)}
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:block">{t(item.hint)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
