import type { SurveyPayload } from "@/lib/payload"
import type { Template } from "@/types/survey"

export async function fetchTemplates(lang: string, fail = false): Promise<Template[]> {
  const params = new URLSearchParams({ lang })
  if (fail) params.set("fail", "1")

  const res = await fetch(`/api/survey-templates?${params}`)
  if (!res.ok) throw new Error(`Templates request failed (${res.status})`)
  return res.json()
}

export async function submitSurvey(payload: SurveyPayload, fail = false) {
  const res = await fetch(`/api/surveys${fail ? "?fail=1" : ""}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Submit failed (${res.status})`)
}
