import React, { ReactNode } from "react"
import { cn } from "theme/cn"

interface ButtonLoaderProps {
  children: ReactNode
  onClick?: () => void
  isLoading?: boolean
  customLoader?: ReactNode
  disabled?: boolean
  className?: string
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  children,
  onClick,
  isLoading = false,
  customLoader,
  disabled = false,
  className = "",
}) => {
  const defaultLoader = (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
  )

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "px-4 py-2 bg-primary-500 border-2 border-slate-400/10 shadow-inner shadow-white/50 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          {customLoader || defaultLoader}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
