import React from "react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { getPublicTasks } from "~/actions"
import { Filter } from "~/components/feed/Filter"
import { User, DollarSign, Home, Search, User as UserIcon } from "lucide-react"
import { Heart, Share, Wallet } from "lucide-react"

const FeedItem = ({
  username,
  handle,
  // rating,
  title,
  bounty,
  estimatedTime,
}: {
  username: string
  handle: string
  // rating: number
  title: string
  bounty: number
  estimatedTime: number
}) => (
  <div className="bg-black/30 rounded-3xl p-6 mb-4 max-w-md mx-auto">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-[40px] h-[40px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
        <div>
          <h2 className="text-white font-semibold">{username}</h2>
          <p className="text-gray-400 text-sm">{handle}</p>
        </div>
      </div>
    </div>

    <p className="text-white text-sm">{title}</p>

    <div className="mb-6">
      <h4 className="text-gray-400 text-sm mb-2">Requirements:</h4>
      <div className="flex space-x-2">
        <span className=" text-white px-4 py-0.5 rounded-md border border-whitetext-sm">
          ${bounty}
        </span>
        <span className=" text-white px-4 py-0.5 rounded-md border border-white text-sm">
          {estimatedTime}
        </span>
      </div>
    </div>

    <div className="flex justify-between text-gray-400 mt-4">
      <button className="flex flex-col items-center">
        <Heart className="w-3 h-3 mb-1" />
        <span className="text-xs">I want it</span>
      </button>
      <button className="flex flex-col items-center">
        <Share className="w-3 h-3 mb-1" />
        <span className="text-xs">
          I know who
          <br />
          want it
        </span>
      </button>
      <button className="flex flex-col items-center">
        <Wallet className="w-3 h-3 mb-1" />
        <span className="text-xs">
          I am ready to
          <br />
          pay for that
        </span>
      </button>
    </div>
  </div>
)

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["explore"],
    queryFn: async () => {
      const res = await getPublicTasks({})
      console.log(res)
      return res
    },
  })
  if (error) return <></>
  if (isLoading) return <></>

  return (
    <div className="min-h-screen pt-16">
      {" "}
      {/* Add pt-16 for top padding */}
      <main className="container mx-auto px-4">
        {data?.map((task, index) => <FeedItem key={index} {...task} />)}
      </main>
    </div>
  )
}

export const Route = createFileRoute("/_layout/explore")({
  component: RouteComponent,
})

export default RouteComponent
