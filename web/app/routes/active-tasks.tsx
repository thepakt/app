import { createFileRoute } from "@tanstack/react-router"
import Layout from "~/components/Layout"

function TasksComponent() {
  return (
    <Layout>
      <div className="w-full flex items-center justify-center">tasks route</div>
    </Layout>
  )
}

export const Route = createFileRoute("/active-tasks")({
  component: TasksComponent,
})
