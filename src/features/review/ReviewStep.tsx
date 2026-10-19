import type { ReactNode } from "react"
import { AlertCircle, FileText, Pencil } from "lucide-react"
import { StepHeading } from "@/components/common/StepHeading"
import { TypeBadge } from "@/components/common/TypeBadge"
import { Button } from "@/components/ui/button"
import { useWizard } from "@/hooks/useWizard"
import { useT } from "@/i18n/useT"
import { formatSize, isImage } from "@/lib/files"
import { useSurvey } from "@/store/useSurvey"
import type { Question } from "@/types/survey"

function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  const t = useT()
  return (
    <section className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h3 className="font-bold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit} className="text-brand">
          <Pencil />
          {t("edit")}
        </Button>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function ReviewAnswer({ q }: { q: Question }) {
  const t = useT()
  const empty = <span className="text-muted-foreground italic">{t("noAnswer")}</span>

  if (q.type === "MC") {
    const picked = q.options.filter((o) => q.choices.includes(o.id))
    if (picked.length === 0) return empty
    return (
      <div className="flex flex-wrap gap-1.5">
        {picked.map((option) => (
          <span key={option.id} className="rounded-sm bg-accent px-2 py-1 text-sm font-medium text-brand">
            {option.label}
          </span>
        ))}
      </div>
    )
  }

  if (q.type === "DDL" || q.type === "RADIO") {
    const picked = q.options.find((o) => o.id === q.answer)
    return picked ? <p className="font-medium">{picked.label}</p> : empty
  }

  if (q.type === "ATTACHMENT") {
    if (q.files.length === 0) return <span className="text-muted-foreground italic">{t("noFiles")}</span>
    return (
      <ul className="flex flex-wrap gap-3">
        {q.files.map((file) => (
          <li key={file.id} className="w-28">
            {isImage(file.type) ? (
              <img src={file.url} alt={file.name} className="aspect-[4/3] w-full rounded-sm border border-border object-cover" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-sm bg-accent text-brand">
                <FileText className="size-6" />
              </div>
            )}
            <p className="mt-1 truncate text-xs">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
          </li>
        ))}
      </ul>
    )
  }

  return q.answer.trim() ? <p className="whitespace-pre-wrap break-words">{q.answer}</p> : empty
}

export function ReviewStep() {
  const t = useT()
  const { goTo } = useWizard()
  const settings = useSurvey((s) => s.settings)
  const questions = useSurvey((s) => s.questions)
  const submitStatus = useSurvey((s) => s.submitStatus)

  return (
    <section className="space-y-6">
      <StepHeading title={t("reviewTitle")} description={t("reviewDesc")} />

      <Section title={t("settingsSection")} onEdit={() => goTo(1)}>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[200px_minmax(0,1fr)]">
          <dt className="text-sm text-muted-foreground">{t("fieldTitle")}</dt>
          <dd className="break-words font-semibold">{settings.title}</dd>
          <dt className="text-sm text-muted-foreground">{t("fieldDesc")}</dt>
          <dd className="break-words">{settings.description || <span className="text-muted-foreground">—</span>}</dd>
          <dt className="text-sm text-muted-foreground">{t("fieldConfirm")}</dt>
          <dd className="break-words">{settings.confirmation}</dd>
        </dl>
      </Section>

      <Section title={`${t("questionsSection")} (${questions.length})`} onEdit={() => goTo(2)}>
        <ol className="divide-y divide-border">
          {questions.map((q, i) => (
            <li key={q.id} className="space-y-2 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  {i + 1}. {q.label}
                </span>
                <TypeBadge type={q.type} />
                {q.required && <span className="text-xs font-semibold text-coral">{t("required")}</span>}
              </div>
              <ReviewAnswer q={q} />
            </li>
          ))}
        </ol>
      </Section>

      {submitStatus === "error" && (
        <p role="alert" className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {t("errSubmit")}
        </p>
      )}
    </section>
  )
}
