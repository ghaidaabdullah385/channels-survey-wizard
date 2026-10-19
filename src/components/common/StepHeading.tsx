import { useEffect, useRef } from "react"

let firstLoad = true

// focus the heading for screen readers
export function StepHeading({ title, description }: { title: string; description: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (firstLoad) {
      firstLoad = false
      return
    }
    ref.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="space-y-1">
      <h2 ref={ref} tabIndex={-1} className="text-2xl font-bold outline-none">
        {title}
      </h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
