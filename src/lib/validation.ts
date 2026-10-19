import { z } from "zod"
import type { TKey } from "@/i18n/translations"
import { MAX_ANSWER, MAX_CONFIRMATION, MAX_DESCRIPTION, MAX_TITLE } from "@/lib/limits"
import { isChoice } from "@/lib/questionTypes"
import type { Question, Settings } from "@/types/survey"

// messages are translation keys
const settingsSchema = z.object({
  title: z.string().trim().min(1, "errTitleRequired").max(MAX_TITLE, "errTitleTooLong"),
  description: z.string().max(MAX_DESCRIPTION, "errDescTooLong"),
  confirmation: z.string().trim().min(1, "errConfirmRequired").max(MAX_CONFIRMATION, "errConfirmTooLong"),
})

export type SettingsErrors = Partial<Record<keyof Settings, TKey>>

export function validateSettings(settings: Settings): SettingsErrors {
  const result = settingsSchema.safeParse(settings)
  if (result.success) return {}

  const errors: SettingsErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof Settings
    errors[field] ??= issue.message as TKey
  }
  return errors
}

export function hasAnswer(q: Question) {
  if (q.type === "MC") return q.choices.length > 0
  if (q.type === "ATTACHMENT") return q.files.length > 0
  return q.answer.trim() !== ""
}

export function validateQuestion(q: Question): TKey | null {
  if (!q.label.trim()) return "errLabelRequired"
  if (q.type === "TEXT" && !(q.maxLength >= 1 && q.maxLength <= MAX_ANSWER)) return "errMaxLength"
  if (isChoice(q.type)) {
    if (q.options.length < 2) return "errOptionsMin"
    if (q.options.some((o) => !o.label.trim())) return "errOptionEmpty"
  }
  return null
}

export function validateQuestions(questions: Question[]) {
  const errors: Record<string, TKey> = {}
  for (const q of questions) {
    const error = validateQuestion(q)
    if (error) errors[q.id] = error
  }
  return errors
}
