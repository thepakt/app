import { Outlet, createFileRoute } from "@tanstack/react-router"
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

  useEffect(() => {
    try {
      const initData = initInitData()
      if (initData) {
        // console.log(initData.user.username ?? initData.user.id)
        postEvent("web_app_expand")
        postEvent("web_app_setup_swipe_behavior", {
          allow_vertical_swipe: false,
        })
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
