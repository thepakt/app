import { Outlet, createFileRoute } from "@tanstack/react-router"
import { JazzAndAuth } from "~/lib/providers/jazz-provider"

function LayoutComponent() {
  return (
    <>
      <JazzAndAuth>
        <Outlet />
      </JazzAndAuth>
    </>
  )
}

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
})
