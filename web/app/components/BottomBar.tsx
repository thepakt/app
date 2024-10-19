import { Link } from "@tanstack/react-router"

export default function Bottombar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#F2F2F7] shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          <BottomBarItem icon={<ExploreIcon />} href="/explore" />
          <BottomBarItem icon={<TasksIcon />} href="/active-tasks" />
          <BottomBarItem icon={<ProfileIcon />} href="/profile" />
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
      href={href}
      className="flex flex-col items-center py-2 px-4 transition-colors"
    >
      <div className="text-[#8E8E93] hover:text-[#007AFF] active:text-[#007AFF]">
        {icon}
      </div>
    </Link>
  )
}

function ExploreIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TasksIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 14L11 16L15 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.90625 20.2491C3.82834 18.6531 5.15423 17.3278 6.75128 16.4064C8.34833 15.485 10.1575 15 12 15C13.8425 15 15.6517 15.4851 17.2487 16.4065C18.8458 17.3279 20.1717 18.6533 21.0938 20.2493"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
