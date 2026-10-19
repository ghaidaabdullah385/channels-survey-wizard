import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWizard } from "@/hooks/useWizard"
import { useT } from "@/i18n/useT"
import { useSurvey } from "@/store/useSurvey"

export function WizardNav() {
  const t = useT()
  const { step, next, back } = useWizard()
  const submit = useSurvey((s) => s.submit)
  const sending = useSurvey((s) => s.submitStatus === "sending")

  return (
    <div className="mt-10 border-t border-border pt-6">
      <div className="flex items-center justify-between gap-3">
        {step > 1 ? (
          <Button variant="outline" size="lg" onClick={back}>
            <ArrowLeft className="rtl:rotate-180" />
            {t("back")}
          </Button>
        ) : (
          <span />
        )}

        <span className="hidden text-sm text-muted-foreground sm:block">{t("stepOf", { current: step, total: 3 })}</span>

        {step < 3 ? (
          <Button size="lg" onClick={next}>
            {t("next")}
            <ArrowRight className="rtl:rotate-180" />
          </Button>
        ) : (
          <Button size="lg" onClick={submit} disabled={sending} className="bg-coral text-white hover:bg-coral/90">
            {sending ? <Loader2 className="animate-spin" /> : <Send className="rtl:-scale-x-100" />}
            {sending ? t("submitting") : t("submit")}
          </Button>
        )}
      </div>
    </div>
  )
}
