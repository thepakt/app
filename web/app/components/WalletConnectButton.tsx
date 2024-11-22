import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react"
import { Button, Menu, buttonStyles } from "./ui"
import { IconChevronDown, IconLogout } from "justd-icons"

export default function WalletConnectButton() {
  const { state, open, close } = useTonConnectModal()
  const address = useTonAddress(true)
  const tonConnect = useTonConnectUI()

  async function disconnect() {
    await tonConnect[0].disconnect()
  }

  return (
    <>
      {address && (
        <Menu respectScreen={false}>
          <Menu.Trigger
            className={buttonStyles({
              appearance: "outline",
              intent: "secondary",
            })}
          >
            {address.substring(0, 4) +
              "..." +
              address.substring(address.length - 4)}
            <IconChevronDown />
          </Menu.Trigger>
          <Menu.Content showArrow placement="bottom" className="min-w-48">
            <Menu.Item className="cursor-pointer">Copy address</Menu.Item>
            <Menu.Separator />
            <Menu.Item
              isDanger
              className="cursor-pointer"
              onAction={disconnect}
            >
              <IconLogout />
              Disconnect
            </Menu.Item>
          </Menu.Content>
        </Menu>
      )}
      {!address && (
        <Button
          appearance="solid"
          size="medium"
          aria-label="Connect Wallet"
          onPress={open}
        >
          Connect Wallet
        </Button>
      )}
    </>
  )
}
