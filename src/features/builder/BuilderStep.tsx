import { StepHeading } from "@/components/common/StepHeading"
import { useT } from "@/i18n/useT"
import { AddQuestionBar } from "./AddQuestionBar"
import { QuestionList } from "./QuestionList"
import { TemplatePicker } from "./TemplatePicker"

export function BuilderStep() {
  const t = useT()

  return (
    <section className="space-y-8">
      <StepHeading title={t("builderTitle")} description={t("builderDesc")} />
      <TemplatePicker />
      <AddQuestionBar />
      <QuestionList />
    </section>
  )
}
