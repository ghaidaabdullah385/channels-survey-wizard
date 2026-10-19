import { useT } from "@/i18n/useT"
import { QUESTION_TYPES, TYPE_ICONS } from "@/lib/questionTypes"
import { useSurvey } from "@/store/useSurvey"
import { useToast } from "@/store/useToast"
import type { QuestionType } from "@/types/survey"

export function AddQuestionBar() {
  const t = useT()
  const addQuestion = useSurvey((s) => s.addQuestion)
  const showToast = useToast((s) => s.show)

  function add(type: QuestionType) {
    const id = addQuestion(type)
    showToast(t("questionAdded"))
    setTimeout(() => {
      const input = document.getElementById(`q-${id}-label`)
      input?.focus({ preventScroll: true })
      input?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 50)
  }

  return (
    <div>
      <h3 className="mb-3 font-bold">{t("addQuestion")}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {QUESTION_TYPES.map((type) => {
          const Icon = TYPE_ICONS[type]
          return (
            <button
              key={type}
              type="button"
              onClick={() => add(type)}
              className="group flex flex-col items-start gap-2 rounded-md border border-dashed border-input p-3 text-start transition-colors hover:border-brand hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="grid size-8 place-items-center rounded-sm bg-accent text-brand transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-semibold">{t(`type${type}`)}</span>
              <span className="text-xs text-muted-foreground">{t(`type${type}Hint`)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
