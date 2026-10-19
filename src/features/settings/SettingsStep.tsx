import type { ReactNode } from "react"
import { FieldError } from "@/components/common/FieldError"
import { StepHeading } from "@/components/common/StepHeading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useT } from "@/i18n/useT"
import { MAX_CONFIRMATION, MAX_DESCRIPTION, MAX_TITLE } from "@/lib/limits"
import { validateSettings } from "@/lib/validation"
import { useSurvey } from "@/store/useSurvey"

type FieldProps = {
  id: string
  label: string
  required?: boolean
  note?: string
  hint?: string
  error?: string
  children: ReactNode
}

function Field({ id, label, required, note, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-sm font-semibold">
          {label}
          {required && <span className="text-coral" aria-hidden="true"> *</span>}
        </Label>
        {note && <span className="text-xs tabular-nums text-muted-foreground">{note}</span>}
      </div>
      {children}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export function SettingsStep() {
  const t = useT()
  const settings = useSurvey((s) => s.settings)
  const updateSettings = useSurvey((s) => s.updateSettings)
  const showErrors = useSurvey((s) => s.showErrors[1])

  const errors = showErrors ? validateSettings(settings) : {}
  const errorText = (field: keyof typeof errors) => {
    const key = errors[field]
    return key ? t(key) : undefined
  }

  return (
    <section className="space-y-8">
      <StepHeading title={t("settingsTitle")} description={t("settingsDesc")} />

      <div className="space-y-6">
        <Field id="title" label={t("fieldTitle")} required note={`${settings.title.length}/${MAX_TITLE}`} error={errorText("title")}>
          <Input
            id="title"
            value={settings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder={t("fieldTitlePh")}
            maxLength={MAX_TITLE}
            aria-required="true"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className="h-11"
          />
        </Field>

        <Field
          id="description"
          label={t("fieldDesc")}
          note={`${t("optional")} · ${settings.description.length}/${MAX_DESCRIPTION}`}
          error={errorText("description")}
        >
          <Textarea
            id="description"
            value={settings.description}
            onChange={(e) => updateSettings({ description: e.target.value })}
            placeholder={t("fieldDescPh")}
            maxLength={MAX_DESCRIPTION}
            rows={3}
            className="max-h-40"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
        </Field>

        <Field
          id="confirmation"
          label={t("fieldConfirm")}
          required
          note={`${settings.confirmation.length}/${MAX_CONFIRMATION}`}
          hint={t("fieldConfirmHint")}
          error={errorText("confirmation")}
        >
          <Textarea
            id="confirmation"
            value={settings.confirmation}
            onChange={(e) => updateSettings({ confirmation: e.target.value })}
            placeholder={t("fieldConfirmPh")}
            rows={2}
            maxLength={MAX_CONFIRMATION}
            className="max-h-40"
            aria-required="true"
            aria-invalid={!!errors.confirmation}
            aria-describedby={errors.confirmation ? "confirmation-error" : undefined}
          />
        </Field>
      </div>
    </section>
  )
}
