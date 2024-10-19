import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/tasks/app")({
  component: () => <div>Hello /tasks/app!</div>,
})
