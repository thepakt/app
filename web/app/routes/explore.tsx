import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div className="w-full flex items-center justify-center">explore route</div>
  )
}

export const Route = createFileRoute("/explore")({
  component: () => <RouteComponent />,
})
