export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const MAX_FILES = 5

export const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export const ACCEPT_ATTR = ".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx"

export const isImage = (type: string) => type.startsWith("image/")

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
