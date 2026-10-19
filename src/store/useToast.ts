import { create } from "zustand"

type ToastState = {
  message: string | null
  show: (message: string) => void
}

let timer: number | undefined

export const useToast = create<ToastState>()((set) => ({
  message: null,
  show: (message) => {
    clearTimeout(timer)
    set({ message })
    timer = window.setTimeout(() => set({ message: null }), 2500)
  },
}))
