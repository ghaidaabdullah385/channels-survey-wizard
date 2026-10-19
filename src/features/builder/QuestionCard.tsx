import { useState, type ReactNode } from "react"
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion"
import { ArrowDown, ArrowUp, ChevronDown, GripVertical, Trash2 } from "lucide-react"
import { FieldError } from "@/components/common/FieldError"
import { Toggle } from "@/components/common/Toggle"
import { TypeBadge } from "@/components/common/TypeBadge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TKey } from "@/i18n/translations"
import { useT } from "@/i18n/useT"
import { MAX_ANSWER, MAX_LABEL } from "@/lib/limits"
import { isChoice } from "@/lib/questionTypes"
import { cn } from "@/lib/utils"
import { useSurvey } from "@/store/useSurvey"
import { useToast } from "@/store/useToast"
import type { Question } from "@/types/survey"
import { OptionsEditor } from "./OptionsEditor"

type Props = {
  question: Question
  index: number
  total: number
  error?: TKey
}

function IconButton({ label, onClick, disabled, danger, children }: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-8 place-items-center rounded-sm text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 [&_svg]:size-4",
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-accent hover:text-brand"
      )}
    >
      {children}
    </button>
  )
}

export function QuestionCard({ question: q, index, total, error }: Props) {
  const t = useT()
  const dragControls = useDragControls()
  const updateQuestion = useSurvey((s) => s.updateQuestion)
  const removeQuestion = useSurvey((s) => s.removeQuestion)
  const moveQuestion = useSurvey((s) => s.moveQuestion)
  const showToast = useToast((s) => s.show)

  const [open, setOpen] = useState(q.source === "custom")
  const [prevError, setPrevError] = useState(error)

  // open on error
  if (error !== prevError) {
    setPrevError(error)
    if (error) setOpen(true)
  }

  const id = `q-${q.id}`

  function changeMaxLength(input: number) {
    const value = Math.min(input, MAX_ANSWER)
    updateQuestion(q.id, { maxLength: value, answer: value > 0 ? q.answer.slice(0, value) : q.answer })
  }

  function remove() {
    removeQuestion(q.id)
    showToast(t("questionRemoved"))
  }

  return (
    <Reorder.Item
      value={q}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px -20px rgb(74 13 135 / 0.5)" }}
      tabIndex={-1}
      data-invalid={!!error || undefined}
      aria-labelledby={`${id}-title`}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "list-none overflow-hidden rounded-md border bg-card outline-none transition-colors",
        error ? "border-destructive" : "border-border focus-within:border-brand/50"
      )}
    >
      <div className={cn("flex items-center gap-1 px-2 py-1.5", open && "border-b border-border")}>
        <button
          type="button"
          onPointerDown={(e) => dragControls.start(e)}
          aria-label={t("dragHandle")}
          title={t("dragHandle")}
          className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-sm text-muted-foreground hover:bg-accent active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-sm px-1 py-1 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span id={`${id}-title`} className="shrink-0 text-sm font-bold">
            {t("questionLabel", { n: index + 1 })}
          </span>
          <TypeBadge type={q.type} />
          {!open && <span className="truncate text-sm text-muted-foreground">{q.label || t("untitledQuestion")}</span>}
          <ChevronDown className={cn("ms-auto size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>

        <div className="flex shrink-0 items-center">
          <IconButton label={t("moveUp")} onClick={() => moveQuestion(q.id, -1)} disabled={index === 0}>
            <ArrowUp />
          </IconButton>
          <IconButton label={t("moveDown")} onClick={() => moveQuestion(q.id, 1)} disabled={index === total - 1}>
            <ArrowDown />
          </IconButton>
          <IconButton label={t("deleteQuestion")} onClick={remove} danger>
            <Trash2 />
          </IconButton>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-body`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-5 p-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-label`} className="text-sm font-semibold">
                  {t("questionText")}
                </Label>
                <Input
                  id={`${id}-label`}
                  value={q.label}
                  onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                  placeholder={t("questionPh")}
                  maxLength={MAX_LABEL}
                  aria-invalid={error === "errLabelRequired"}
                  className="h-11 text-base"
                />
              </div>

              {isChoice(q.type) && <OptionsEditor question={q} />}

              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
                  <Toggle
                    id={`${id}-required`}
                    checked={q.required}
                    onCheckedChange={(checked) => updateQuestion(q.id, { required: checked })}
                  />
                  <Label htmlFor={`${id}-required`}>{t("required")}</Label>
                </div>
                {q.type === "TEXT" && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${id}-max`}>{t("maxChars")}</Label>
                    <Input
                      id={`${id}-max`}
                      type="number"
                      min={1}
                      max={MAX_ANSWER}
                      value={q.maxLength || ""}
                      onChange={(e) => changeMaxLength(Number(e.target.value))}
                      aria-invalid={error === "errMaxLength"}
                      className="h-9 w-24"
                    />
                    <span className="text-xs text-muted-foreground">{t("maxCharsHint", { max: MAX_ANSWER })}</span>
                  </div>
                )}
              </div>

              <FieldError id={`${id}-error`} message={error ? t(error) : null} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  )
}
