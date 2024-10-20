import { Outlet, createFileRoute, useRouter } from "@tanstack/react-router"
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
  const pathname = useRouter().state.location.pathname

  return (
    <>
      <div className="absolute top-4 right-4">
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
