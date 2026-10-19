import { create } from "zustand"
import { submitSurvey } from "@/api/surveyApi"
import { translations } from "@/i18n/translations"
import { DEFAULT_ANSWER } from "@/lib/limits"
import { buildPayload } from "@/lib/payload"
import { isChoice } from "@/lib/questionTypes"
import { usePrefs } from "@/store/usePrefs"
import type { Option, Question, QuestionType, Settings, Template, UploadedFile } from "@/types/survey"

export type Step = 1 | 2 | 3
type SubmitStatus = "idle" | "sending" | "error"

type SurveyState = {
  started: boolean
  step: Step
  settings: Settings
  questions: Question[]
  templateId: string | null
  submitted: boolean
  submitStatus: SubmitStatus
  showErrors: Record<Step, boolean>
  networkError: boolean

  start: () => void
  setStep: (step: Step) => void
  setShowErrors: (step: Step, show: boolean) => void
  updateSettings: (patch: Partial<Settings>) => void
  applyTemplate: (template: Template) => void
  removeTemplate: () => void
  addQuestion: (type: QuestionType) => string
  updateQuestion: (id: string, patch: Partial<Question>) => void
  removeQuestion: (id: string) => void
  moveQuestion: (id: string, offset: -1 | 1) => void
  setQuestions: (questions: Question[]) => void
  addFiles: (id: string, files: UploadedFile[]) => void
  removeFile: (id: string, fileId: string) => void
  submit: () => Promise<void>
  setNetworkError: (value: boolean) => void
  reset: () => void
}

function initialSettings(): Settings {
  const lang = usePrefs.getState().lang
  return { title: "", description: "", confirmation: translations[lang].defaultConfirm }
}

export function newOption(): Option {
  return { id: crypto.randomUUID(), label: "" }
}

function newQuestion(type: QuestionType, overrides: Partial<Question> = {}): Question {
  return {
    id: crypto.randomUUID(),
    type,
    label: "",
    required: false,
    maxLength: DEFAULT_ANSWER,
    options: isChoice(type) ? [newOption(), newOption()] : [],
    answer: "",
    choices: [],
    files: [],
    source: "custom",
    ...overrides,
  }
}

// free the file previews
function revokeFiles(questions: Question[]) {
  questions.forEach((q) => q.files.forEach((f) => URL.revokeObjectURL(f.url)))
}

export const useSurvey = create<SurveyState>()((set, get) => ({
  started: false,
  step: 1,
  settings: initialSettings(),
  questions: [],
  templateId: null,
  submitted: false,
  submitStatus: "idle",
  showErrors: { 1: false, 2: false, 3: false },
  networkError: false,

  start: () => set({ started: true }),

  setStep: (step) => set({ step }),

  setShowErrors: (step, show) => set((s) => ({ showErrors: { ...s.showErrors, [step]: show } })),

  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

  applyTemplate: (template) =>
    set((s) => {
      revokeFiles(s.questions.filter((q) => q.source === "template"))
      const fromTemplate = template.questions.map((q) =>
        newQuestion(q.type, {
          label: q.label,
          required: q.required ?? false,
          maxLength: q.maxLength ?? DEFAULT_ANSWER,
          options: q.options ?? [],
          source: "template",
        })
      )
      const custom = s.questions.filter((q) => q.source === "custom")
      return { templateId: template.id, questions: [...fromTemplate, ...custom] }
    }),

  removeTemplate: () =>
    set((s) => {
      revokeFiles(s.questions.filter((q) => q.source === "template"))
      return { templateId: null, questions: s.questions.filter((q) => q.source === "custom") }
    }),

  addQuestion: (type) => {
    const question = newQuestion(type)
    set((s) => ({ questions: [...s.questions, question] }))
    return question.id
  },

  updateQuestion: (id, patch) =>
    set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),

  removeQuestion: (id) =>
    set((s) => {
      revokeFiles(s.questions.filter((q) => q.id === id))
      return { questions: s.questions.filter((q) => q.id !== id) }
    }),

  moveQuestion: (id, offset) =>
    set((s) => {
      const from = s.questions.findIndex((q) => q.id === id)
      const to = from + offset
      if (to < 0 || to >= s.questions.length) return {}
      const questions = [...s.questions]
      ;[questions[from], questions[to]] = [questions[to], questions[from]]
      return { questions }
    }),

  setQuestions: (questions) => set({ questions }),

  addFiles: (id, files) =>
    set((s) => ({
      questions: s.questions.map((q) => (q.id === id ? { ...q, files: [...q.files, ...files] } : q)),
    })),

  removeFile: (id, fileId) =>
    set((s) => ({
      questions: s.questions.map((q) => {
        if (q.id !== id) return q
        const file = q.files.find((f) => f.id === fileId)
        if (file) URL.revokeObjectURL(file.url)
        return { ...q, files: q.files.filter((f) => f.id !== fileId) }
      }),
    })),

  submit: async () => {
    const { settings, questions, templateId, networkError } = get()
    set({ submitStatus: "sending" })
    try {
      await submitSurvey(buildPayload(settings, questions, templateId), networkError)
      set({ submitted: true, submitStatus: "idle" })
    } catch {
      set({ submitStatus: "error" })
    }
  },

  setNetworkError: (value) => set({ networkError: value }),

  reset: () => {
    revokeFiles(get().questions)
    set({
      step: 1,
      settings: initialSettings(),
      questions: [],
      templateId: null,
      submitted: false,
      submitStatus: "idle",
      showErrors: { 1: false, 2: false, 3: false },
    })
  },
}))

// default message follows the language
usePrefs.subscribe((state, prev) => {
  if (state.lang === prev.lang) return
  const { settings, updateSettings } = useSurvey.getState()
  if (settings.confirmation === translations[prev.lang].defaultConfirm) {
    updateSettings({ confirmation: translations[state.lang].defaultConfirm })
  }
})
