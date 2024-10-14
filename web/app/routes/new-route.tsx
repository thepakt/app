import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/new-route")({
  component: () => <div>Hello /new-route!</div>,
})
