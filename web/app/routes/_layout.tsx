import { Outlet, createFileRoute } from "@tanstack/react-router"
import { initInitData, postEvent } from "@telegram-apps/sdk"
import { Address } from "@ton/core"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import { useEffect } from "react"
import { createUser, updateTgUsername, updateTgPhoto } from "~/actions"
import Bottombar from "~/components/BottomBar"
import NavigationWrapper from "~/components/NavigationWrapper"

// Update just 1 time per session: on startup or after creating the account
let hasUpdatedUserInfo = false

async function updateUserInfo(address: string) {
  if (hasUpdatedUserInfo) return

  try {
    const initData = initInitData()
    if (initData) {
      // when i have tg username
      await updateTgUsername({
        tgUsername:
          initData.user?.username || initData.user?.id?.toString() || "unknown",
        walletAddress: Address.parse(address).toString(),
      })

      // update photo as well
      await updateTgPhoto({
        tgPhotoUrl: initData.user?.photoUrl ?? "",
        walletAddress: Address.parse(address).toString(),
      })

      hasUpdatedUserInfo = true
    }
  } catch (e) {
    console.log("The app runs outside of the telegram")
  }
}

function LayoutComponent() {
  const address = useTonAddress()
  useEffect(() => {
    if (address) {
      createUser({ walletAddress: address })
      updateUserInfo(address)
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

        updateUserInfo(address)
      }
    } catch (e) {
      console.log("The app runs outside of the telegram")
    }
  }, [])

  return (
    <>
      <NavigationWrapper>
        <Outlet />
        <Bottombar />
      </NavigationWrapper>
    </>
  )
}

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
})
