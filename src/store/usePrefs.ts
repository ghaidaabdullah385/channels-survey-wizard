import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark"
export type Lang = "en" | "ar"

type PrefsState = {
  theme: Theme
  lang: Lang
  toggleTheme: () => void
  setLang: (lang: Lang) => void
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      theme: "light",
      lang: "en",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setLang: (lang) => set({ lang }),
    }),
    { name: "channels-prefs" }
  )
)
