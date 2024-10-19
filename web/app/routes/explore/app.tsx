import { createFileRoute } from "@tanstack/react-router"
import Layout from "~/components/Layout"

function ExploreComponent() {
  return (
    <Layout>
      <div className="w-full flex items-center justify-center">
        explore route
      </div>
    </Layout>
  )
}

export const Route = createFileRoute("/explore/app")({
  component: ExploreComponent,
})
