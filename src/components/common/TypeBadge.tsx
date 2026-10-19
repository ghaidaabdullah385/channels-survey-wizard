import { useT } from "@/i18n/useT"
import { TYPE_ICONS } from "@/lib/questionTypes"
import type { QuestionType } from "@/types/survey"

export function TypeBadge({ type }: { type: QuestionType }) {
  const t = useT()
  const Icon = TYPE_ICONS[type]

  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5 text-xs font-semibold text-brand">
      <Icon className="size-3.5" />
      {t(`type${type}`)}
    </span>
  )
}
