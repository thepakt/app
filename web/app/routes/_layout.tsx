import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router"
import { initInitData, postEvent } from "@telegram-apps/sdk"
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

  useEffect(() => {
    try {
      const initData = initInitData()
      if (initData) {
        postEvent("web_app_open_popup", {
          title: "user id",
          message: initData.user.id,
          buttons: [{ id: "1", type: "ok", text: "ok" }],
        })
        postEvent("web_app_expand")
      }
    } catch (e) {
      console.log("The app runs outside of the telegram")
    }
  }, [])

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
