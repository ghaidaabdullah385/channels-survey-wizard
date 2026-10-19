import { AnimatePresence, Reorder } from "framer-motion"
import { AlertCircle, ListPlus } from "lucide-react"
import { useT } from "@/i18n/useT"
import { cn } from "@/lib/utils"
import { validateQuestions } from "@/lib/validation"
import { useSurvey } from "@/store/useSurvey"
import { QuestionCard } from "./QuestionCard"

export function QuestionList() {
  const t = useT()
  const questions = useSurvey((s) => s.questions)
  const setQuestions = useSurvey((s) => s.setQuestions)
  const showErrors = useSurvey((s) => s.showErrors[2])

  const errors = showErrors ? validateQuestions(questions) : {}
  const errorCount = Object.keys(errors).length

  if (questions.length === 0) {
    return (
      <div
        tabIndex={-1}
        data-invalid={showErrors || undefined}
        className={cn(
          "flex flex-col items-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center outline-none",
          showErrors ? "border-destructive/60" : "border-border"
        )}
      >
        <ListPlus className="size-8 text-brand" />
        <p className="font-semibold">{t("emptyTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("emptyText")}</p>
        {showErrors && (
          <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive">
            <AlertCircle className="size-4" />
            {t("errNoQuestions")}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {errorCount > 0 && (
        <p role="alert" className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {t("errFixBelow", { count: errorCount })}
        </p>
      )}

      <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-3">
        <AnimatePresence initial={false}>
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={index}
              total={questions.length}
              error={errors[q.id]}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}
