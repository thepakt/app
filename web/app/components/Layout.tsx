import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import React from "react"
import { useAccount } from "~/lib/providers/jazz-provider"
import Bottombar from "./BottomBar"

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const { me } = useAccount({})
  const address = useTonAddress()

  // useEffect(() => {
  //   if (!me?.root) return
  //   if (me.root.walletAddress === address) return
  //   me.root.walletAddress = address
  // }, [address, me?.root])

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 right-4">
        <TonConnectButton />
      </div>
      {me?.root?.walletAddress === address && <>{children}</>}
      <Bottombar />
    </div>
  )
}

export default Layout
