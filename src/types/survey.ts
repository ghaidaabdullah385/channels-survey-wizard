export type QuestionType = "MC" | "DDL" | "RADIO" | "TEXT" | "ATTACHMENT"

export type Option = {
  id: string
  label: string
}

export type UploadedFile = {
  id: string
  file: File
  name: string
  size: number
  type: string
  url: string
}

export type Question = {
  id: string
  type: QuestionType
  label: string
  required: boolean
  maxLength: number
  options: Option[]
  answer: string
  choices: string[]
  files: UploadedFile[]
  source: "template" | "custom"
}

export type Settings = {
  title: string
  description: string
  confirmation: string
}

export type TemplateQuestion = {
  type: QuestionType
  label: string
  required?: boolean
  maxLength?: number
  options?: Option[]
}

export type Template = {
  id: string
  name: string
  icon: "users" | "store" | "smile"
  questions: TemplateQuestion[]
}
