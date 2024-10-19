import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/profile/app")({
  component: () => <div>Hello /profile/app!</div>,
})
