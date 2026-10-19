import { delay, http, HttpResponse } from "msw"
import { getTemplates } from "./templates"

// ?fail makes it fail
export const handlers = [
  http.get("/api/survey-templates", async ({ request }) => {
    await delay(1200)
    const url = new URL(request.url)
    if (url.searchParams.has("fail")) {
      return HttpResponse.json({ message: "Service unavailable" }, { status: 503 })
    }
    const lang = url.searchParams.get("lang") === "ar" ? "ar" : "en"
    return HttpResponse.json(getTemplates(lang))
  }),

  http.post("/api/surveys", async ({ request }) => {
    await delay(1000)
    if (new URL(request.url).searchParams.has("fail")) {
      return HttpResponse.json({ message: "Service unavailable" }, { status: 503 })
    }
    const survey = (await request.json()) as { questions: unknown[] }
    return HttpResponse.json({ message: "Survey created", questionCount: survey.questions.length }, { status: 201 })
  }),
]
