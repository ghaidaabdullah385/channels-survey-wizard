import { validateQuestions, validateSettings } from "@/lib/validation"
import { useSurvey, type Step } from "@/store/useSurvey"

function canLeave(step: Step) {
  const { settings, questions } = useSurvey.getState()
  if (step === 1) return Object.keys(validateSettings(settings)).length === 0
  if (step === 2) return questions.length > 0 && Object.keys(validateQuestions(questions)).length === 0
  return true
}

function focusFirstError() {
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>("[aria-invalid='true'], [data-invalid='true']")
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, 300)
}

export function useWizard() {
  const step = useSurvey((s) => s.step)

  function goTo(target: Step) {
    const { setStep, setShowErrors } = useSurvey.getState()

    for (let s = step; s < target; s++) {
      const current = s as Step
      if (!canLeave(current)) {
        setStep(current)
        setShowErrors(current, true)
        focusFirstError()
        return
      }
    }
    setStep(target)
  }

  return {
    step,
    goTo,
    next: () => goTo((step + 1) as Step),
    back: () => goTo((step - 1) as Step),
  }
}
