import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/active-tasks/app")({
  component: () => <div>Hello /tasks/app!</div>,
})
