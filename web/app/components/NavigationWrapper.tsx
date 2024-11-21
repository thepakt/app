import { Outlet } from "@tanstack/react-router"
import {
  IconBag,
  IconBell,
  IconBrandJustd,
  IconCircleCheck,
  IconCompass,
  IconCreditCard,
  IconSearch,
} from "justd-icons"
import { Button, Navbar, Sidebar } from "~/components/ui"
import WalletConnectButton from "./WalletConnectButton"

export default function NavbarWrapper(props: any) {  

  return (
    <Sidebar.Provider>
      <Sidebar intent="floating" collapsible="dock">
        <Sidebar.Content>
          <Sidebar.Section title="Might happen" className="mt-8">
            <Sidebar.Item icon={IconCircleCheck} href="inbox">
              <div className="flex flex-col">
                <span className="text-base">Create</span>
                <span className="text-xs">Things You Would Like To Do</span>
              </div>
            </Sidebar.Item>
            <Sidebar.Item icon={IconCompass} href="explore">
              <div className="flex flex-col">
                <span className="text-base">Explore</span>
                <span className="text-xs">What Others Wish to Make</span>
              </div>
            </Sidebar.Item>
          </Sidebar.Section>
          <Sidebar.Section collapsible title="Happening">
            <Sidebar.Item icon={IconBag} href="chat">
              <div className="flex flex-col">
                <span className="text-base">To do</span>
              </div>
            </Sidebar.Item>
            <Sidebar.Item icon={IconCreditCard} href="chat">
              <div className="flex flex-col">
                <span className="text-base">To do</span>
              </div>
            </Sidebar.Item>
          </Sidebar.Section>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Section collapsible title="Has happened" />
        </Sidebar.Footer>
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
              {/* <Navbar.Logo href="/docs/components/navigation/navbar">
                <IconBrandJustd className="size-5" />
              </Navbar.Logo> */}
            </Navbar.Flex>
            <Navbar.Flex>
              <Button
                appearance="plain"
                size="square-petite"
                aria-label="Search for products"
              >
                <IconBell />
              </Button>
              <WalletConnectButton />
              {/* TODO: fix <TonConnectButton /> . When 2 buttons switch visibility with media queries, 1/2 buttons is rendered */}
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
              <WalletConnectButton />
              {/* <TonConnectButton /> */}
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
