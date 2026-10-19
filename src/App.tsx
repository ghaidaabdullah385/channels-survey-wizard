import { AnimatePresence, MotionConfig } from "framer-motion"
import { Direction } from "radix-ui"
import { Header } from "@/components/layout/Header"
import { Toaster } from "@/components/common/Toaster"
import { Wizard } from "@/components/wizard/Wizard"
import { Welcome } from "@/features/welcome/Welcome"
import { useApplyPrefs } from "@/hooks/useApplyPrefs"
import { useT } from "@/i18n/useT"
import { usePrefs } from "@/store/usePrefs"
import { useSurvey } from "@/store/useSurvey"

export default function App() {
  useApplyPrefs()
  const t = useT()
  const lang = usePrefs((s) => s.lang)
  const started = useSurvey((s) => s.started)

  // radix needs the direction too
  return (
    <Direction.DirectionProvider dir={lang === "ar" ? "rtl" : "ltr"}>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {t("skipToContent")}
        </a>

        <div className="flex min-h-dvh flex-col">
          <Header />
          <main id="main" className="flex flex-1 flex-col">
            <AnimatePresence mode="wait">
              {started ? <Wizard key="wizard" /> : <Welcome key="welcome" />}
            </AnimatePresence>
          </main>
        </div>

        <Toaster />
      </MotionConfig>
    </Direction.DirectionProvider>
  )
}
