import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useT } from "@/i18n/useT"
import { usePrefs } from "@/store/usePrefs"

const LANG_NAMES = { en: "English", ar: "العربية" }

export function PrefsToggle() {
  const { theme, lang, toggleTheme, setLang } = usePrefs()
  const t = useT()
  const other = lang === "en" ? "ar" : "en"

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        lang={other}
        onClick={() => setLang(other)}
        title={t("switchLanguage")}
        className="rounded-md px-3 py-2 font-medium text-coral transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LANG_NAMES[other]}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={t("toggleTheme")}
        title={t("toggleTheme")}
        className="grid size-10 place-items-center rounded-md text-brand transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            exit={{ rotate: 90, scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}
