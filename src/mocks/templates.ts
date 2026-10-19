import type { QuestionType, Template } from "@/types/survey"

type Text = { en: string; ar: string }

type RawQuestion = {
  type: QuestionType
  label: Text
  required?: boolean
  maxLength?: number
  options?: { en: string[]; ar: string[] }
}

type RawTemplate = {
  id: string
  icon: Template["icon"]
  name: Text
  questions: RawQuestion[]
}

const templates: RawTemplate[] = [
  {
    id: "employee-satisfaction",
    icon: "users",
    name: { en: "Employee satisfaction", ar: "رضا الموظفين" },
    questions: [
      {
        type: "RADIO",
        required: true,
        label: { en: "How satisfied are you with your work environment?", ar: "ما مدى رضاك عن بيئة العمل؟" },
        options: {
          en: ["Very satisfied", "Satisfied", "Neutral", "Not satisfied"],
          ar: ["راضٍ جداً", "راضٍ", "محايد", "غير راضٍ"],
        },
      },
      {
        type: "MC",
        label: { en: "What helps you do your best work?", ar: "ما الذي يساعدك على أداء عملك بأفضل شكل؟" },
        options: {
          en: ["Clear goals", "Good tools", "Flexible hours", "Training"],
          ar: ["أهداف واضحة", "أدوات مناسبة", "ساعات عمل مرنة", "التدريب"],
        },
      },
      {
        type: "DDL",
        required: true,
        label: { en: "Which department are you in?", ar: "ما القسم الذي تعمل فيه؟" },
        options: {
          en: ["Sales", "Operations", "Logistics", "Customer care", "IT"],
          ar: ["المبيعات", "العمليات", "الخدمات اللوجستية", "خدمة العملاء", "تقنية المعلومات"],
        },
      },
      {
        type: "TEXT",
        maxLength: 500,
        label: { en: "What would you like us to improve?", ar: "ما الذي تقترح تحسينه؟" },
      },
    ],
  },
  {
    id: "store-check",
    icon: "store",
    name: { en: "Store check", ar: "فحص المتجر" },
    questions: [
      {
        type: "RADIO",
        required: true,
        label: { en: "Is the store front clean and well lit?", ar: "هل واجهة المتجر نظيفة ومضاءة جيداً؟" },
        options: { en: ["Yes", "Partly", "No"], ar: ["نعم", "جزئياً", "لا"] },
      },
      {
        type: "MC",
        label: { en: "Which areas need maintenance?", ar: "ما المناطق التي تحتاج إلى صيانة؟" },
        options: {
          en: ["Entrance", "Shelves", "Lighting", "Fitting rooms", "Checkout area"],
          ar: ["المدخل", "الرفوف", "الإضاءة", "غرف القياس", "منطقة الدفع"],
        },
      },
      {
        type: "DDL",
        required: true,
        label: { en: "Overall store condition", ar: "الحالة العامة للمتجر" },
        options: { en: ["Excellent", "Good", "Fair", "Poor"], ar: ["ممتازة", "جيدة", "مقبولة", "ضعيفة"] },
      },
      {
        type: "ATTACHMENT",
        required: true,
        label: { en: "Photo of the store front", ar: "صورة واجهة المتجر" },
      },
      {
        type: "TEXT",
        maxLength: 500,
        label: { en: "Inspector notes", ar: "ملاحظات المفتش" },
      },
    ],
  },
  {
    id: "customer-satisfaction",
    icon: "smile",
    name: { en: "Customer satisfaction", ar: "رضا العملاء" },
    questions: [
      {
        type: "RADIO",
        required: true,
        label: { en: "How likely are you to recommend us?", ar: "ما مدى احتمال أن توصي بنا؟" },
        options: { en: ["Very likely", "Possibly", "Unlikely"], ar: ["مرجّح جداً", "محتمل", "غير مرجّح"] },
      },
      {
        type: "DDL",
        label: { en: "How did you hear about us?", ar: "كيف عرفت عنا؟" },
        options: {
          en: ["X", "LinkedIn", "Email", "A friend", "Other"],
          ar: ["منصة X", "لينكدإن", "البريد الإلكتروني", "صديق", "أخرى"],
        },
      },
      {
        type: "TEXT",
        label: { en: "Name", ar: "الاسم" },
      },
      {
        type: "TEXT",
        maxLength: 500,
        label: { en: "Describe your experience", ar: "صِف لنا تجربتك" },
      },
    ],
  },
]

export function getTemplates(lang: "en" | "ar"): Template[] {
  return templates.map((t) => ({
    id: t.id,
    icon: t.icon,
    name: t.name[lang],
    questions: t.questions.map((q) => ({
      type: q.type,
      label: q.label[lang],
      required: q.required,
      maxLength: q.maxLength,
      options: q.options?.[lang].map((label, i) => ({ id: `opt-${i + 1}`, label })),
    })),
  }))
}
