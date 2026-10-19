import { isChoice } from "@/lib/questionTypes"
import type { Question, Settings } from "@/types/survey"

function getAnswer(q: Question) {
  if (q.type === "MC") return q.choices
  if (q.type === "ATTACHMENT") return q.files.map(({ name, size, type }) => ({ name, size, type }))
  return q.answer.trim() || null
}

export function buildPayload(settings: Settings, questions: Question[], templateId: string | null) {
  return {
    title: settings.title.trim(),
    description: settings.description.trim(),
    confirmationMessage: settings.confirmation.trim(),
    templateId,
    questions: questions.map((q, index) => ({
      id: q.id,
      order: index + 1,
      type: q.type,
      label: q.label.trim(),
      required: q.required,
      ...(isChoice(q.type) ? { options: q.options.map((o) => ({ id: o.id, label: o.label.trim() })) } : {}),
      ...(q.type === "TEXT" ? { maxLength: q.maxLength } : {}),
      answer: getAnswer(q),
    })),
  }
}

export type SurveyPayload = ReturnType<typeof buildPayload>
