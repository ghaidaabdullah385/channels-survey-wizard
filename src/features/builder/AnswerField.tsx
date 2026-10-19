import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MAX_ANSWER, SHORT_ANSWER } from "@/lib/limits"
import { useT } from "@/i18n/useT"
import { useSurvey } from "@/store/useSurvey"
import type { Question } from "@/types/survey"
import { FileDrop } from "./FileDrop"

export function AnswerField({ question: q }: { question: Question }) {
  const t = useT()
  const updateQuestion = useSurvey((s) => s.updateQuestion)

  const id = `q-${q.id}-answer`
  const label = q.label || t("questionPh")
  const options = q.options.filter((o) => o.label.trim())

  if (q.type === "ATTACHMENT") return <FileDrop question={q} />

  if (q.type === "TEXT") {
    const limit = q.maxLength >= 1 && q.maxLength <= MAX_ANSWER ? q.maxLength : MAX_ANSWER
    const props = {
      id,
      "aria-label": label,
      value: q.answer,
      maxLength: limit,
      onChange: (e: { target: { value: string } }) => updateQuestion(q.id, { answer: e.target.value }),
    }
    return (
      <div className="space-y-1">
        {limit > SHORT_ANSWER ? (
          <Textarea {...props} placeholder={t("notesPh")} rows={3} className="max-h-40" />
        ) : (
          <Input {...props} placeholder={t("answerPh")} />
        )}
        <p className="text-end text-xs text-muted-foreground">
          {q.answer.length}/{limit}
        </p>
      </div>
    )
  }

  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("optionsFirst")}</p>
  }

  if (q.type === "DDL") {
    return (
      <Select value={q.answer} onValueChange={(value) => updateQuestion(q.id, { answer: value })}>
        <SelectTrigger id={id} aria-label={label} className="w-full">
          <SelectValue placeholder={t("selectPh")} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (q.type === "RADIO") {
    return (
      <RadioGroup
        value={q.answer}
        onValueChange={(value) => updateQuestion(q.id, { answer: value })}
        aria-label={label}
        className="gap-3"
      >
        {options.map((option, i) => (
          <div key={option.id} className="flex items-center gap-2">
            <RadioGroupItem value={option.id} id={`${id}-${i}`} />
            <Label htmlFor={`${id}-${i}`} className="font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  return (
    <div role="group" aria-label={label} className="grid gap-3">
      {options.map((option, i) => (
        <div key={option.id} className="flex items-center gap-2">
          <Checkbox
            id={`${id}-${i}`}
            checked={q.choices.includes(option.id)}
            onCheckedChange={(checked) =>
              updateQuestion(q.id, {
                choices: checked === true ? [...q.choices, option.id] : q.choices.filter((c) => c !== option.id),
              })
            }
          />
          <Label htmlFor={`${id}-${i}`} className="font-normal">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  )
}
