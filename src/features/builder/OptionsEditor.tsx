import { motion } from "framer-motion"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useT } from "@/i18n/useT"
import { MAX_OPTION } from "@/lib/limits"
import { cn } from "@/lib/utils"
import { newOption, useSurvey } from "@/store/useSurvey"
import type { Question } from "@/types/survey"

export function OptionsEditor({ question: q }: { question: Question }) {
  const t = useT()
  const updateQuestion = useSurvey((s) => s.updateQuestion)

  function renameOption(id: string, label: string) {
    updateQuestion(q.id, { options: q.options.map((o) => (o.id === id ? { ...o, label } : o)) })
  }

  function removeOption(id: string) {
    updateQuestion(q.id, {
      options: q.options.filter((o) => o.id !== id),
      answer: q.answer === id ? "" : q.answer,
      choices: q.choices.filter((c) => c !== id),
    })
  }

  function addOption() {
    updateQuestion(q.id, { options: [...q.options, newOption()] })
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{t("options")}</legend>
      <p className="mb-3 text-sm text-muted-foreground">{t("optionsHint")}</p>

      {q.options.map((option, i) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-5 shrink-0 place-items-center border-2 border-input text-[10px] font-bold text-muted-foreground",
              q.type === "RADIO" ? "rounded-full" : "rounded-sm",
              q.type === "DDL" && "border-0"
            )}
          >
            {q.type === "DDL" && i + 1}
          </span>
          <Input
            value={option.label}
            onChange={(e) => renameOption(option.id, e.target.value)}
            placeholder={t("optionPh", { n: i + 1 })}
            maxLength={MAX_OPTION}
            aria-label={t("optionPh", { n: i + 1 })}
            className="h-9"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeOption(option.id)}
            disabled={q.options.length <= 2}
            aria-label={t("removeOption", { n: i + 1 })}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X />
          </Button>
        </motion.div>
      ))}

      <Button variant="ghost" size="sm" onClick={addOption} className="text-brand">
        <Plus />
        {t("addOption")}
      </Button>
    </fieldset>
  )
}
