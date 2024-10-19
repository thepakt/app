import { createFileRoute } from "@tanstack/react-router"
import { ThumbsDownIcon, ThumbsUp, ThumbsUpIcon } from "lucide-react"
import { FeedItem } from "./feed"
import { useState } from "react"
import { UserData } from "~/components/profile/userData"

const RouteComponent = () => {
  return (
    <main className="w-full flex items-center justify-center">
      <section className="w-full p-4 py-[70px] max-w-[500px] h-full relative min-h-screen">
        <div className="flex gap-3 relative">
          <div className="w-[100px] h-[100px] bg-neutral-700 rounded-lg"></div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-sm text-gray-500">@john_doe</p>
            <p className="text-sm mt-3 px-3 text-gray-400 bg-neutral-700 p-1 rounded-md">
              100 tasks completed
            </p>
          </div>
          <div className=" absolute top-0 right-0 flex items-center mt-3 gap-4">
            <span className="text-sm text-green-500 flex gap-1">
              98% <ThumbsUpIcon className="w-4 h-4" />
            </span>
            <span className="text-sm text-red-500 flex gap-1">
              2% <ThumbsDownIcon className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute("/profile")({
  component: () => <RouteComponent />,
})
