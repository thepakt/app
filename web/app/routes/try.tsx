import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { ButtonLoader } from "~/components/ButtonLoader"

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(0)
  return (
    <div className="flex items-center flex-col gap-4 justify-center h-screen">
      <ButtonLoader
        className="w-[160px] h-[50px]"
        onClick={() => {
          setIsLoading(true)
          setValue(1000)
        }}
        isLoading={isLoading}
      >
        Click me
      </ButtonLoader>
    </div>
  )
}

export const Route = createFileRoute("/try")({
  component: () => <RouteComponent />,
})
