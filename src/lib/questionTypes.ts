import { ChevronDown, CircleDot, ListChecks, Paperclip, Type, type LucideIcon } from "lucide-react"
import type { QuestionType } from "@/types/survey"

export const TYPE_ICONS: Record<QuestionType, LucideIcon> = {
  MC: ListChecks,
  DDL: ChevronDown,
  RADIO: CircleDot,
  TEXT: Type,
  ATTACHMENT: Paperclip,
}

export const QUESTION_TYPES = Object.keys(TYPE_ICONS) as QuestionType[]

export const isChoice = (type: QuestionType) => type === "MC" || type === "DDL" || type === "RADIO"
