import { TonConnectButton } from "@tonconnect/ui-react"
import React from "react"
import Bottombar from "./BottomBar"
import { useRouter } from "@tanstack/react-router"

interface LayoutProps {
  children: React.ReactNode
}

// TODO: delete this..
function Layout({ children }: LayoutProps) {
  const pathname = useRouter().state.location.pathname
  return (
    <div className="relative w-full">
      <div className="w-full relative max-w-2xl mx-auto">
        {children}
        <Bottombar />
      </div>
    </div>
  )
}

export default Layout
