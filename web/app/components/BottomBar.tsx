import { Link } from "@tanstack/react-router"
import { LayoutList, Telescope, User } from "lucide-react"

export default function Bottombar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          <BottomBarItem icon={<Telescope />} href="/explore" />
          <BottomBarItem icon={<LayoutList />} href="/tasks" />
          <BottomBarItem icon={<User />} href="/profile" />
        </div>
      </div>
    </div>
  )
}

function BottomBarItem({
  icon,
  href,
}: {
  icon: React.ReactNode
  href: string
}) {
  return (
    <Link
      to={href}
      className="flex flex-col items-center py-2 px-4 transition-colors"
    >
      {({ isActive }) => (
        <>{isActive ? <div className="text-[#007AFF]">{icon}</div> : icon}</>
      )}
    </Link>
  )
}
