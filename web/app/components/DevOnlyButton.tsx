export function DevOnlyButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  if (process.env.NODE_ENV !== "development") return null
  return (
    <button
      className="px-4 mr-auto py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 text-left w-[50%] mb-4"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
