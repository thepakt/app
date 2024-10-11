import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react"

function RouteComponent() {
  const wallet = useTonWallet()
  console.log(wallet)
  return (
    <div>
      <TonConnectButton style={{}} className="ton-connect-button" />
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
