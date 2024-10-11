import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"
import clipboard from "clipboardy"

export const onClickWithoutBubblingToTheParentOnClicks = (
  event: React.MouseEvent<HTMLDivElement>,
) => {
  event.stopPropagation()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function appendToClipboard(
  newClipboard: string | object | Array<unknown>,
): void {
  if (typeof newClipboard === "object" || Array.isArray(newClipboard)) {
    clipboard.writeSync(JSON.stringify(newClipboard))
    return
  }
  clipboard.writeSync(newClipboard)
}

export const isProduction = process.env.NODE_ENV === "production"
