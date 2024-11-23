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
import { Button, Navbar, ProgressCircle, Sidebar } from "~/components/ui"
import WalletConnectButton from "./WalletConnectButton"
import { Separator } from "react-aria-components"

export default function NavbarWrapper(props: any) {
  const activeTasks: {
    title: string
    subtitle: string
    currentProgress: number
    totalProgress: number
  }[] = [
    {
      title: "Soup'em All VR: Art Revolution Simulator",
      subtitle: "Build soup physics engine (I know a guy)",
      currentProgress: 5,
      totalProgress: 10,
    },
    {
      title: "Yet Another Project",
      subtitle: "Launch a starship and land the boosters",
      currentProgress: 1,
      totalProgress: 3,
    },
    {
      title: "Yet Another Project",
      subtitle: "Launcrs",
      currentProgress: 1,
      totalProgress: 3,
    },
  ]

  return (
    <Sidebar.Provider>
      <Sidebar intent="floating" collapsible="dock">
        <Sidebar.Content>
          <Sidebar.Section title="Might happen" className="mt-8">
            <Sidebar.Item icon={IconCircleCheck} href="tasks">
              <div className="flex flex-col">
                <span className="text-base">Create & Manage</span>
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
            {activeTasks.map((task, index) => (
              <Sidebar.Item
                key={index}
                iconComponent={
                  <ProgressCircle
                    data-slot="icon"
                    value={task.currentProgress}
                    minValue={0}
                    maxValue={task.totalProgress}
                    className="text-accent mr-1"
                  />
                }
                href="chat"
              >
                <div className="flex flex-col max-w-[220px] sm:max-w-[180px] pl-1 sm:pl-0 truncate overflow-hidden">
                  <span className="text-base truncate text-ellipsis w-[300px] min-w-[300px]">
                    {task.title}
                  </span>
                  <span className="text-xs truncate text-ellipsis">
                    {task.subtitle}
                  </span>
                </div>
              </Sidebar.Item>
            ))}
            {activeTasks.length == 0 && (
              <p className="text-gray-400 text-xs font-serif italic mb-2 p-2 border-dashed border-muted rounded-md border-2 w-full">
                Create tasks, invest in ideas, or get funded – your projects will appear here
              </p>
            )}
          </Sidebar.Section>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Section collapsible title="Has happened">
            <p className="text-gray-400 text-xs font-serif italic mb-2 p-2 border-dashed border-muted rounded-md border-2 w-full">
              Once you complete a project, it will appear here
            </p>
          </Sidebar.Section>
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset>
        {/* TODO: check why isSticky does not work */}
        <Navbar intent="navbar" isSticky={true}>
          {/* Desktop */}
          <Navbar.Nav className="justify-between">
            <Navbar.Flex>
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
              <Sidebar.Trigger />
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
