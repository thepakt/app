import { TonConnectButton } from "@tonconnect/ui-react"
import React from "react"
import Bottombar from "./BottomBar"

interface LayoutProps {
  children: React.ReactNode
}

// TODO: delete this..
function Layout({ children }: LayoutProps) {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 right-4">
        <TonConnectButton />
      </div>
      {children}
      <Bottombar />
    </div>
  )
}

export default Layout
