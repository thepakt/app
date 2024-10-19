import { Globe, ListTodo, CircleUserRound } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function Bottombar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          <BottomBarItem icon={<Globe size={22} />} label="Explore" href="/" />
          <BottomBarItem
            icon={<ListTodo size={22} />}
            label="Tasks"
            href="/tasks"
          />
          <BottomBarItem
            icon={<CircleUserRound size={22} />}
            label="Profile"
            href="/profile"
          />
        </div>
      </div>
    </div>
  )
}

function BottomBarItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center py-2 px-4 transition-colors"
    >
      <div className="text-gray-400 hover:text-blue-500">{icon}</div>
      <span className="text-[10px] mt-1 font-medium text-gray-500">
        {label}
      </span>
    </Link>
  )
}
