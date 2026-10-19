import { useEffect } from "react"
import { usePrefs } from "@/store/usePrefs"

export function useApplyPrefs() {
  const theme = usePrefs((s) => s.theme)
  const lang = usePrefs((s) => s.lang)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.lang = lang
    root.dir = lang === "ar" ? "rtl" : "ltr"
  }, [theme, lang])
}
