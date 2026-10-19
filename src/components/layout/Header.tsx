import { useT } from "@/i18n/useT"
import { NetworkErrorToggle } from "./NetworkErrorToggle"
import { PrefsToggle } from "./PrefsToggle"

export function Header() {
  const t = useT()

  return (
    <header className="shrink-0 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {/* white in dark mode */}
          <img src="/channel-logo-color.webp" alt="channels by stc" className="h-9 w-auto dark:brightness-0 dark:invert" />
          <span className="hidden h-8 w-px bg-border sm:block" />
          <span className="hidden font-heading text-sm font-bold text-brand sm:block">{t("appTitle")}</span>
        </a>
        <div className="flex items-center gap-1">
          <NetworkErrorToggle />
          <PrefsToggle />
        </div>
      </div>
    </header>
  )
}
