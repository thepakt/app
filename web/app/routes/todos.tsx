import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

function RouteComponent() {
  const [todos, setTodos] = useState([
    {
      title: "make backend work",
      bounty: 1500,
    },
  ])
  return (
    <>
      <div className="w-[600px] bg-red-500 h-screen">
        <div>todo 1</div>
      </div>
    </>
  )
}

export const Route = createFileRoute("/todos")({
  component: () => <RouteComponent />,
})
