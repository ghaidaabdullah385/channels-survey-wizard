import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Check, Eye, Send } from "lucide-react"
import { FieldError } from "@/components/common/FieldError"
import { PixelMark } from "@/components/common/PixelMark"
import { Button } from "@/components/ui/button"
import { useT } from "@/i18n/useT"
import { cn } from "@/lib/utils"
import { hasAnswer } from "@/lib/validation"
import { useSurvey } from "@/store/useSurvey"
import { AnswerField } from "./AnswerField"

export function LivePreview() {
  const t = useT()
  const settings = useSurvey((s) => s.settings)
  const questions = useSurvey((s) => s.questions)
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const isMissing = (q: (typeof questions)[number]) => tried && q.required && !hasAnswer(q)

  function testSubmit() {
    setTried(true)
    const complete = questions.every((q) => !q.required || hasAnswer(q))
    if (complete) {
      setSent(true)
      return
    }
    setTimeout(() => {
      const first = listRef.current?.querySelector<HTMLElement>("[data-missing='true']")
      first?.scrollIntoView({ behavior: "smooth", block: "center" })
      first?.focus({ preventScroll: true })
    }, 50)
  }

  function backToForm() {
    setSent(false)
    setTried(false)
  }

  return (
    <aside aria-label={t("livePreview")} className="lg:flex lg:max-h-[calc(100dvh-10rem)] lg:flex-col">
      <div className="mb-3 shrink-0">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Eye className="size-4" />
          {t("livePreview")}
        </p>
        {questions.length > 0 && <p className="mt-1 text-sm text-muted-foreground">{t("previewHint")}</p>}
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card lg:flex lg:min-h-0 lg:flex-col">
        <div className="relative shrink-0 overflow-hidden bg-band px-5 pb-5 pt-6 text-white">
          <PixelMark className="absolute -top-1 end-2 opacity-70" cell="size-2.5" />
          <h3 className="break-words pe-10 text-lg font-bold">{settings.title || t("untitled")}</h3>
          {settings.description && <p className="mt-1 break-words text-sm text-white/80">{settings.description}</p>}
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 px-5 py-10 text-center"
          >
            <motion.span
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="grid size-14 place-items-center rounded-md bg-coral text-white"
            >
              <Check className="size-7" strokeWidth={3} />
            </motion.span>
            <p className="text-balance font-heading text-lg font-bold" role="status">
              {settings.confirmation}
            </p>
            <Button variant="outline" size="sm" onClick={backToForm}>
              <ArrowLeft className="rtl:rotate-180" />
              {t("backToForm")}
            </Button>
          </motion.div>
        ) : (
          <>
            <div
              ref={listRef}
              className="space-y-4 p-4 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:[mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-24px),transparent)]"
            >
              {questions.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">{t("previewEmpty")}</p>}

              <AnimatePresence initial={false}>
                {questions.map((q, i) => {
                  const missing = isMissing(q)
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      tabIndex={-1}
                      data-missing={missing || undefined}
                      className={cn(
                        "space-y-3 rounded-md border p-3 outline-none transition-colors",
                        missing ? "border-destructive bg-destructive/5" : "border-transparent"
                      )}
                    >
                      <p className="break-words text-sm font-semibold">
                        {i + 1}. {q.label || t("untitledQuestion")}
                        {q.required && <span className="text-coral"> *</span>}
                      </p>
                      <AnswerField question={q} />
                      <FieldError id={`q-${q.id}-answer-error`} message={missing ? t("errAnswerRequired") : null} />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {questions.length > 0 && (
              <div className="shrink-0 border-t border-border p-4">
                <Button onClick={testSubmit} className="w-full">
                  <Send className="rtl:-scale-x-100" />
                  {t("testSubmit")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
