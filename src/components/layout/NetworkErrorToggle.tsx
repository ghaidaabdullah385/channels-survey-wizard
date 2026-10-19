import { Wifi, WifiOff } from "lucide-react"
import { useT } from "@/i18n/useT"
import { cn } from "@/lib/utils"
import { useSurvey } from "@/store/useSurvey"
import { useTemplates } from "@/store/useTemplates"
import { useToast } from "@/store/useToast"

// makes the mock API fail
export function NetworkErrorToggle() {
  const t = useT()
  const networkError = useSurvey((s) => s.networkError)
  const setNetworkError = useSurvey((s) => s.setNetworkError)
  const loadTemplates = useTemplates((s) => s.load)
  const showToast = useToast((s) => s.show)
  const usesApi = useSurvey((s) => s.started && s.step >= 2 && !s.submitted)

  function toggle() {
    const value = !networkError
    setNetworkError(value)
    showToast(t(value ? "networkErrorOnDone" : "networkErrorOffDone"))
    loadTemplates()
  }

  if (!usesApi) return null

  const label = t(networkError ? "networkErrorOff" : "networkErrorOn")

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={networkError}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        networkError ? "bg-coral/15 text-coral" : "text-brand hover:bg-accent"
      )}
    >
      {networkError ? <WifiOff className="size-5" /> : <Wifi className="size-5" />}
    </button>
  )
}
