import { useRef, useState, type DragEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, FileText, Upload, X } from "lucide-react"
import { useT } from "@/i18n/useT"
import { ACCEPT_ATTR, ACCEPTED_TYPES, formatSize, isImage, MAX_FILE_SIZE, MAX_FILES } from "@/lib/files"
import { cn } from "@/lib/utils"
import { useSurvey } from "@/store/useSurvey"
import type { Question, UploadedFile } from "@/types/survey"

export function FileDrop({ question: q }: { question: Question }) {
  const t = useT()
  const addFiles = useSurvey((s) => s.addFiles)
  const removeFile = useSurvey((s) => s.removeFile)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [problems, setProblems] = useState<string[]>([])

  const inputId = `q-${q.id}-answer`

  function handleFiles(list: FileList | null) {
    if (!list) return
    const accepted: UploadedFile[] = []
    const rejected: string[] = []

    for (const file of Array.from(list)) {
      if (q.files.length + accepted.length >= MAX_FILES) {
        rejected.push(t("errFileCount"))
        break
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(t("errFileType", { name: file.name }))
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(t("errFileSize", { name: file.name }))
        continue
      }
      accepted.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })
    }

    if (accepted.length) addFiles(q.id, accepted)
    setProblems(rejected)
    if (inputRef.current) inputRef.current.value = ""
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed bg-card px-3 py-5 text-center transition-colors focus-within:ring-2 focus-within:ring-ring",
          dragging ? "border-brand bg-accent" : "border-input hover:border-brand/60"
        )}
      >
        <motion.span
          animate={{ y: dragging ? -4 : 0 }}
          className="grid size-10 place-items-center rounded-sm bg-accent text-brand"
        >
          <Upload className="size-5" />
        </motion.span>
        <span className="text-sm font-semibold">{t("dropTitle")}</span>
        <span className="text-xs text-muted-foreground">{t("dropHint")}</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          aria-label={q.label || t("dropTitle")}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
      </label>

      {problems.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm font-medium text-destructive">
          {problems.map((problem) => (
            <li key={problem} className="flex items-center gap-1.5">
              <AlertCircle className="size-4 shrink-0" />
              {problem}
            </li>
          ))}
        </ul>
      )}

      {q.files.length > 0 && (
        <ul className="grid grid-cols-2 gap-2">
          <AnimatePresence initial={false}>
            {q.files.map((file) => (
              <motion.li
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="overflow-hidden rounded-md border border-border bg-card"
              >
                {isImage(file.type) ? (
                  <img src={file.url} alt={file.name} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-accent">
                    <FileText className="size-8 text-brand" />
                  </div>
                )}
                <div className="flex items-center gap-1 p-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(q.id, file.id)}
                    aria-label={t("removeFile", { name: file.name })}
                    className="grid size-7 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
