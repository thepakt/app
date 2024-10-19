import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Address } from "@ton/core"
import { Heart, Share, Wallet } from "lucide-react"
import { useState } from "react"
import {
  createAcceptTaskNotification,
  getModerator,
  getPublicTasks,
  getTaskWithItsCreator,
} from "~/actions"
import useActions from "~/lib/investor/useActions"

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
}) => {
  const { createContract } = useActions()
  const [waitingForTransaction, setWaitingForTransaction] = useState(false)

  return (
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

      <div className="flex flex-row gap-5 text-white/90 mt-4">
        <button className="flex flex-col items-center w-1/3">
          <Heart className="w-3 h-3 mb-1" />
          <span className="text-[9px] text-center">I want it</span>
        </button>
        <button className="flex flex-col items-center w-1/3">
          <Share className="w-3 h-3 mb-1" />
          <span className="text-[9px] text-center">
            I know who
            <br />
            want it
          </span>
        </button>
        <button
          onClick={async () => {
            const taskWithCreator = await getTaskWithItsCreator({
              taskId: "rec_vlfzjz9y5tfj1qo5",
            })
            console.log(taskWithCreator, "taskWithCreator")
            const moderator = await getModerator({})
            if (!moderator) return
            if (!taskWithCreator.creator?.walletAddress) return
            setWaitingForTransaction(true)
            const createdContractAddress = await createContract({
              performer: Address.parse(taskWithCreator.creator.walletAddress),
              moderator: Address.parse(moderator.walletAddress),
              tokenMaster: Address.parse(
                "kQC6cYfMFYFur2IgJroc3wBxg-q4hOxsqGQwEYSEARxtOmZf", // LOM
              ),
              // TODO: support subtasks
              tasks: [{ amount: BigInt(0) }],
              // TODO: make this value dynamic
              // TODO: make it smart so it adjusts based on the decimals of the jetton
              finishAmount: BigInt(200),
            })
            setWaitingForTransaction(false)
            const acceptTaskNotification = await createAcceptTaskNotification({
              taskId: taskWithCreator.id,
              contractId: createdContractAddress.toString(),
            })
            console.log(acceptTaskNotification, "acceptTaskNotification")
          }}
          className="flex flex-col items-center w-1/3"
        >
          <Wallet className="w-3 h-3 mb-1" />
          <span className="text-[9px] text-center">
            I am ready to
            <br />
            pay for that
          </span>
        </button>
      </div>
    </div>
  )
}

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
      <main className="container mx-auto px-4">
        {/* @ts-ignore */}
        {data?.map((task, index) => <FeedItem key={index} {...task} />)}
      </main>
    </div>
  )
}

export const Route = createFileRoute("/_layout/explore")({
  component: () => <RouteComponent />,
})
