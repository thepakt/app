import { createFileRoute } from "@tanstack/react-router"
import Layout from "~/components/Layout"

function ProfileComponent() {
  return (
    <Layout>
      <div className="w-full flex items-center justify-center">
        profile route
      </div>
    </Layout>
  )
}

export const Route = createFileRoute("/profile/app")({
  component: ProfileComponent,
})
