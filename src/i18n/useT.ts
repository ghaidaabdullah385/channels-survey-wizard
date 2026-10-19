import { usePrefs } from "@/store/usePrefs"
import { translations, type TKey } from "./translations"

export function useT() {
  const lang = usePrefs((s) => s.lang)

  return (key: TKey, vars?: Record<string, string | number>) => {
    let text = translations[lang][key]
    for (const [name, value] of Object.entries(vars ?? {})) {
      text = text.replace(`{${name}}`, String(value))
    }
    return text
  }
}
