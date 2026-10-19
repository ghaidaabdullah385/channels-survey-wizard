import { useEffect } from "react"
import { AlertCircle, Check, RotateCw, Smile, Store, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useT } from "@/i18n/useT"
import { cn } from "@/lib/utils"
import { usePrefs } from "@/store/usePrefs"
import { useSurvey } from "@/store/useSurvey"
import { useTemplates } from "@/store/useTemplates"
import { useToast } from "@/store/useToast"
import type { Template } from "@/types/survey"

const ICONS = { users: Users, store: Store, smile: Smile }

export function TemplatePicker() {
  const t = useT()
  const lang = usePrefs((s) => s.lang)
  const { status, templates, lang: loadedLang, load } = useTemplates()
  const templateId = useSurvey((s) => s.templateId)
  const applyTemplate = useSurvey((s) => s.applyTemplate)
  const removeTemplate = useSurvey((s) => s.removeTemplate)
  const showToast = useToast((s) => s.show)

  useEffect(() => {
    if (loadedLang !== lang) load()
  }, [lang, loadedLang, load])

  function pickTemplate(template: Template) {
    if (template.id === templateId) {
      removeTemplate()
      showToast(t("templateRemoved"))
      return
    }
    applyTemplate(template)
    showToast(t("templateLoaded", { name: template.name }))
  }

  return (
    <div className="rounded-md border border-border bg-muted/60 p-4 sm:p-5">
      <h3 className="mb-4 font-bold">{t("templatesTitle")}</h3>

      {(status === "loading" || status === "idle") && (
        <div role="status" aria-label={t("loadingTemplates")} className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-3 rounded-md border border-border bg-card p-4">
              <Skeleton className="size-10 rounded-sm" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
          <span className="sr-only">{t("loadingTemplates")}</span>
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            {t("errLoadTemplates")}
          </p>
          <Button variant="outline" size="sm" onClick={load}>
            <RotateCw />
            {t("retry")}
          </Button>
        </div>
      )}

      {status === "success" && (
        <div className="grid gap-3 sm:grid-cols-3">
          {templates.map((template) => {
            const Icon = ICONS[template.icon]
            const active = template.id === templateId

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => pickTemplate(template)}
                aria-pressed={active}
                className={cn(
                  "group relative flex flex-col items-start gap-3 rounded-md border bg-card p-4 text-start transition-all hover:-translate-y-0.5 hover:border-brand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "border-coral ring-1 ring-coral" : "border-border"
                )}
              >
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-sm transition-colors",
                    active ? "bg-coral text-white" : "bg-accent text-brand"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {t("questionsCount", { count: template.questions.length })}
                  </span>
                </span>
                {active && (
                  <span className="absolute end-3 top-3 text-xs font-semibold text-coral">
                    <span className="flex items-center gap-1 group-hover:hidden">
                      <Check className="size-3.5" />
                      {t("templateInUse")}
                    </span>
                    <span className="hidden items-center gap-1 group-hover:flex">
                      <X className="size-3.5" />
                      {t("removeTemplate")}
                    </span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
