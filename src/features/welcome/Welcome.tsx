import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useT } from "@/i18n/useT"
import { useSurvey } from "@/store/useSurvey"
import { PixelField } from "./PixelField"
import { SurveyDemo } from "./SurveyDemo"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

export function Welcome() {
  const t = useT()
  const start = useSurvey((s) => s.start)
  const steps = [t("stepSettings"), t("stepQuestions"), t("stepReview")]

  return (
    <motion.section
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-1 flex-col overflow-hidden bg-band text-white"
    >
      <PixelField />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <motion.p {...fadeUp(0)} className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            {t("heroEyebrow")}
          </motion.p>
          <motion.h1 {...fadeUp(0.1)} className="mt-4 text-balance text-4xl font-light leading-tight sm:text-6xl">
            {t("heroLight")} <strong className="font-extrabold">{t("heroBold")}</strong>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="mt-5 max-w-xl text-lg text-white/80">
            {t("heroText")}
          </motion.p>

          <ol className="mt-10 flex flex-wrap gap-3">
            {steps.map((label, i) => (
              <motion.li
                key={label}
                {...fadeUp(0.3 + i * 0.1)}
                className="flex items-center gap-3 rounded-md bg-white/10 px-4 py-2.5 backdrop-blur"
              >
                <span className="grid size-7 place-items-center rounded-sm bg-white font-bold text-primary">{i + 1}</span>
                <span className="font-semibold">{label}</span>
              </motion.li>
            ))}
          </ol>

          <motion.div {...fadeUp(0.6)}>
            <Button
              size="lg"
              onClick={start}
              autoFocus
              className="group mt-12 h-12 bg-coral px-8 text-base text-white hover:bg-coral/90"
            >
              {t("startNow")}
              <ArrowRight className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <SurveyDemo />
      </div>

      <p className="relative mx-auto w-full max-w-6xl px-4 pb-6 text-sm text-white/60 sm:px-6">{t("footerNote")}</p>
    </motion.section>
  )
}
