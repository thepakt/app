import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Address } from "@ton/core"
import { motion } from "framer-motion"
import { Heart, Share, Wallet } from "lucide-react"
import { useState } from "react"
import {
  createAcceptTaskNotification,
  getModerator,
  getPublicTasks,
  getTaskWithItsCreator,
} from "~/actions"
import useActions from "~/lib/investor/useActions"

function RouteComponent() {
  const [waitingForTransaction, setWaitingForTransaction] = useState(false)
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
      {waitingForTransaction && (
        <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black/30 z-50">
          <div className="h-[60px] w-[60px] animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        </div>
      )}
      <main className="container mx-auto px-4">
        {/* @ts-ignore */}
        {data?.map((task, index) => {
          return (
            <FeedItem
              key={index}
              index={index}
              setWaitingForTransaction={setWaitingForTransaction}
              {...task}
              taskId={task.id}
              creator={task.creator}
            />
          )
        })}
      </main>
    </div>
  )
}

const FeedItem = ({
  username,
  handle,
  // rating,
  title,
  notes,
  index,
  bountyPriceInUsdt,
  bountyEstimatedTimeInHours,
  setWaitingForTransaction,
  taskId,
  creator,
}: {
  username: string
  handle: string
  notes: string
  index: number
  setWaitingForTransaction: (waiting: boolean) => void
  title: string
  bountyPriceInUsdt: number
  bountyEstimatedTimeInHours: number
  taskId: string
  creator: {
    walletAddress: string
    prettyName: string
  }
}) => {
  const { createContract } = useActions()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.08 }}
      className="bg-black/30 rounded-3xl rounded-tl-[50px] p-5 mb-3 max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-[50px] h-[50px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div className="pl-2">
            <h2 className="text-white font-semibold">{creator.prettyName}</h2>
            <p className="opacity-70 text-xs">
              {creator.walletAddress.slice(0, 4)}...
              {creator.walletAddress.slice(-4)}
            </p>
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
          {/* TODO: does not work with days */}
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
            try {
              const taskWithCreator = await getTaskWithItsCreator({
                taskId,
              })
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
                // TODO: make it smart so it adjusts based on the decimals of the jetton
                finishAmount: BigInt(bountyPriceInUsdt),
              })
              const acceptTaskNotification = await createAcceptTaskNotification(
                {
                  taskId: taskWithCreator.task.id,
                  contractAddress: createdContractAddress.toString(),
                  recieverWalletAddress: taskWithCreator.creator.walletAddress,
                },
              )
              setWaitingForTransaction(false)
              console.log(acceptTaskNotification, "acceptTaskNotification")
            } catch (err) {
              setWaitingForTransaction(false)
              alert(JSON.stringify(err))
            }
          }}
          className="flex bg-blue-500 hover:bg-blue-600 transition-all justify-center gap-1 w-full items-center p-2 rounded-lg"
        >
          <Wallet className="w-3 h-3 " />
          <span className="text-[10px] text-center">
            I am ready to pay for that
          </span>
        </button>
      </div>
    </motion.div>
  )
}

export const Route = createFileRoute("/_layout/explore")({
  component: () => <RouteComponent />,
})
