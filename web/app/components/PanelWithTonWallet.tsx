import { TonConnectButton } from "@tonconnect/ui-react"

export function PanelWithTonWallet(props: {
  header: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-2xl font-bold ">{props.header}</h2>
        <TonConnectButton />
      </div>
      {props.children}
    </div>
  )
}
