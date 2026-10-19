import { create } from "zustand"
import { fetchTemplates } from "@/api/surveyApi"
import { usePrefs, type Lang } from "@/store/usePrefs"
import { useSurvey } from "@/store/useSurvey"
import type { Template } from "@/types/survey"

type Status = "idle" | "loading" | "error" | "success"

type TemplatesState = {
  status: Status
  templates: Template[]
  lang: Lang | null
  load: () => Promise<void>
}

export const useTemplates = create<TemplatesState>()((set, get) => ({
  status: "idle",
  templates: [],
  lang: null,

  load: async () => {
    const lang = usePrefs.getState().lang
    const fail = useSurvey.getState().networkError
    set({ status: "loading", lang })

    try {
      const templates = await fetchTemplates(lang, fail)
      // ignore old language
      if (get().lang === lang) set({ status: "success", templates })
    } catch {
      if (get().lang === lang) set({ status: "error" })
    }
  },
}))
