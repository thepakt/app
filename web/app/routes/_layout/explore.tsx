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
  notes,
  bountyPriceInUsdt,
  bountyEstimatedTimeInHours,
}: {
  username: string
  handle: string
  notes: string
  title: string
  bountyPriceInUsdt: number
  bountyEstimatedTimeInHours: number
}) => {
  const { createContract } = useActions()
  const [waitingForTransaction, setWaitingForTransaction] = useState(false)

  return (
    <div className="bg-black/30 rounded-3xl p-6 mb-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        {waitingForTransaction && (
          <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black/30 z-50">
            <div className="h-[60px] w-[60px] animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          </div>
        )}
        <div className="flex items-center">
          <div className="w-[40px] h-[40px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div>
            <h2 className="text-white font-semibold">{username}</h2>
            <p className="text-gray-400 text-sm">{handle}</p>
          </div>
        </div>
      </div>

      <p className="text-white text-sm">{title}</p>
      <p className="text-white/50 text-xs mb-3">{notes}</p>

      <div className="flex justify-between items-center">
        <div className="flex gap-1  flex-col">
          <h2 className="text-white text-sm">Bounty:</h2>
          <p className="text-white/50 text-xs">{bountyPriceInUsdt}$</p>
        </div>
        <div className="flex items-end gap-1  flex-col">
          <h2 className="text-white text-sm">Estimated time:</h2>
          <p className="text-white/50 text-xs">
            {bountyEstimatedTimeInHours}{" "}
            {bountyEstimatedTimeInHours === 1 ? "hour" : "hours"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-white/90 mt-4">
        <div className="flex gap-2">
          <button className="flex p-2 gap-1 bg-neutral-700/40 hover:bg-neutral-700 transition-all justify-center rounded-lg items-center w-full">
            <Heart className="w-3 h-3" />
            <span className="text-[10px] text-center">I want it</span>
          </button>
          <button className="flex items-center p-2 gap-1 justify-center hover:bg-neutral-700 transition-all rounded-lg w-full bg-neutral-700/40">
            <Share className="w-3 h-3" />
            <span className="text-[10px] text-center">I know who wants it</span>
          </button>
        </div>
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
            await new Promise((resolve) => setTimeout(resolve, 5000))
            setWaitingForTransaction(false)
            // const createdContractAddress = await createContract({
            //   performer: Address.parse(taskWithCreator.creator.walletAddress),
            //   moderator: Address.parse(moderator.walletAddress),
            //   tokenMaster: Address.parse(
            //     "kQC6cYfMFYFur2IgJroc3wBxg-q4hOxsqGQwEYSEARxtOmZf", // LOM
            //   ),
            //   // TODO: support subtasks
            //   tasks: [{ amount: BigInt(0) }],
            //   // TODO: make this value dynamic
            //   // TODO: make it smart so it adjusts based on the decimals of the jetton
            //   finishAmount: BigInt(200),
            // })
            // setWaitingForTransaction(false)
            // const acceptTaskNotification = await createAcceptTaskNotification({
            //   taskId: taskWithCreator.id,
            //   contractId: createdContractAddress.toString(),
            // })
            // console.log(acceptTaskNotification, "acceptTaskNotification")
          }}
          className="flex bg-blue-500 justify-center gap-1 w-full items-center p-2 rounded-lg"
        >
          <Wallet className="w-3 h-3 " />
          <span className="text-[10px] text-center">
            I am ready to pay for that
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
