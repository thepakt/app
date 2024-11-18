import { Outlet, createFileRoute } from "@tanstack/react-router"
import { TonConnectButton } from "@tonconnect/ui-react"
import {
  IconBag,
  IconBrandJustd,
  IconCompass,
  IconCreditCard,
  IconInbox,
  IconSearch,
} from "justd-icons"
import { Separator } from "react-aria-components"
import { Button, Navbar, Sidebar } from "~/components/ui"

export default function NavbarWrapper(props: any) {
  return (
    <Sidebar.Provider>
      <Sidebar>
        <Sidebar.Content>
          <Sidebar.Section className="mt-12">
            <Sidebar.Item icon={IconInbox} href="inbox">
              Inbox
            </Sidebar.Item>
            <Sidebar.Item icon={IconCompass} href="explore">
              Explore
            </Sidebar.Item>
          </Sidebar.Section>
          <Sidebar.Section title="Active Projects">
            <Sidebar.Item icon={IconBag} href="tasks" />
            <Sidebar.Item icon={IconCreditCard} href="tasks" />
          </Sidebar.Section>
        </Sidebar.Content>
        <Sidebar.Footer />
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset>
        {/* TODO: check why isSticky does not work */}
        <Navbar intent="navbar" isSticky={true}>
          {/* Desktop */}
          <Navbar.Nav className="justify-between">
            <Navbar.Flex>
              {/* <Navbar.Trigger className="-ml-2" />
              <Separator orientation="vertical" className="h-6 mx-2" /> */}
              <Navbar.Logo href="/docs/components/navigation/navbar">
                <IconBrandJustd className="size-5" />
              </Navbar.Logo>
            </Navbar.Flex>
            <Navbar.Flex>
              <Button
                appearance="plain"
                size="square-petite"
                aria-label="Search for products"
              >
                <IconSearch />
              </Button>
              <TonConnectButton />
            </Navbar.Flex>
          </Navbar.Nav>

          {/* Mobile */}
          <Navbar.Compact>
            <Navbar.Flex>
              {/* <Navbar.Trigger className="-ml-2" />
              <Separator orientation="vertical" className="h-6 mx-2" /> */}
              <Navbar.Logo href="/docs/components/navigation/navbar">
                <IconBrandJustd className="size-5" />
              </Navbar.Logo>
            </Navbar.Flex>
            <Navbar.Flex>
              <Button
                appearance="plain"
                size="square-petite"
                aria-label="Search for products"
              >
                <IconSearch />
              </Button>
              <TonConnectButton />
            </Navbar.Flex>
          </Navbar.Compact>

          <Navbar.Inset>
            <Outlet />
          </Navbar.Inset>
        </Navbar>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}
