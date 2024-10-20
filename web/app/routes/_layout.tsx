import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import { useEffect } from "react"
import { createUser } from "~/actions"
import Bottombar from "~/components/BottomBar"

function LayoutComponent() {
  const address = useTonAddress()
  useEffect(() => {
    if (address) {
      createUser({ walletAddress: address })
    }
  }, [address])
  const router = useRouterState()

  return (
    <>
      <div className=" absolute top-4 right-4">
        <TonConnectButton />
      </div>

      <Outlet />
      <Bottombar />
    </>
  )
}

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
})
