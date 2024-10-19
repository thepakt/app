import React from "react"
import Bottombar from "./BottomBar"
import { TonConnectButton } from "@tonconnect/ui-react"

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-4 right-4">
        <TonConnectButton />
      </div>
      {children}
      <Bottombar />
    </div>
  )
}

export default Layout
