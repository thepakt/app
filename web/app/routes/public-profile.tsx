import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/public-profile")({
  component: () => <div>Hello /public-profile!</div>,
})
