import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/explore/app")({
  component: () => <div>Hello /explore/app!</div>,
})
