import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

// mock API
async function enableMocking() {
  const { worker } = await import("./mocks/browser")
  await worker.start({ onUnhandledFrame: "bypass" })

  // hard reload skips the worker, so reload once
  if (navigator.serviceWorker.controller) {
    sessionStorage.removeItem("msw-reload")
  } else if (!sessionStorage.getItem("msw-reload")) {
    sessionStorage.setItem("msw-reload", "1")
    location.reload()
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
