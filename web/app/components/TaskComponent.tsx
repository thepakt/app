import { Task } from "@ronin/todo-escrow"
import { useQueryClient } from "@tanstack/react-query"
import { Address } from "@ton/core"
import { useTonAddress } from "@tonconnect/ui-react"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, Share, Trash, X } from "lucide-react"
import { useState } from "react"
import { deleteTask, getUserByWalletAddress, startWorkOnTask } from "~/actions"
import useActions from "~/lib/investor/useActions"

export function TaskComponent({
  task,
  isExpanded,
  onClick,
  showNotification,
  contractOfTask,
  telegramUsernameOfInvestor,
}: {
  task: Task
  isExpanded: boolean
  onClick: (taskId: string) => void
  showNotification?: boolean
  contractOfTask?: string
  telegramUsernameOfInvestor: string
}) {
  const { startContract, getData } = useActions()
  const address = useTonAddress()
  const [waitingForTransaction, setWaitingForTransaction] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()

  return (
    <motion.div
      layout
      onClick={() => {
        onClick(task.id)
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-black/30 rounded-3xl rounded-tl-[50px] p-5 mb-3 w-full max-w-2xl mx-auto relative"
    >
      {showNotification && (
        <div
          className="absolute top-2 right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center transform cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            setShowModal(true)
          }}
        >
          <Bell size={12} />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        {waitingForTransaction && (
          <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black/30 z-50">
            <div className="h-[60px] w-[60px] animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          </div>
        )}
        <div className="flex items-center">
          <div className="w-[50px] h-[50px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div className="ml-3">
            <h2 className="text-white font-semibold">{task.title}</h2>
            <p className="text-gray-400 text-sm"></p>
          </div>
        </div>
      </div>

      {task.notes && (
        <>
          <p className="text-sm">Notes</p>
          <p className="text-white/50 text-xs mb-4">{task.notes}</p>
        </>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 flex-col">
          <h2 className="text-white text-sm">Bounty:</h2>
          <p className="text-white/50 text-xs">{task.bountyPriceInUsdt}$</p>
        </div>
        <div className="flex items-end gap-1 flex-col">
          <h2 className="text-white text-sm">Estimated time:</h2>
          <p className="text-white/50 text-xs">
            {task.bountyEstimatedTimeInHours}{" "}
            {task.bountyEstimatedTimeInHours === 1 ? "hour" : "hours"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex items-center p-2 gap-1 bg-neutral-700/40 hover:bg-neutral-700 transition-all justify-center rounded-lg w-full">
          <Share className="w-4 h-4" />
          <span className="text-[14px] text-center">Share</span>
        </button>
        <button
          className="flex items-center p-2 gap-1 justify-center hover:bg-neutral-700 transition-all rounded-lg w-full bg-neutral-700/40"
          onClick={async () => {
            const deletedTask = await deleteTask({ taskId: task.id })
            queryClient.invalidateQueries({
              queryKey: ["tasks"],
              refetchType: "all",
            })
            console.log(deletedTask, "deletedTask")
          }}
        >
          <Trash className="w-4 h-4" />
          <span className="text-[14px] text-center">Delete</span>
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 rounded-2xl bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg relative max-w-sm w-full mx-4 border border-white/10"
            >
              <button
                className="absolute top-4 right-4 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
              <h3 className="text-md font-normal mb-4">New Investor Request</h3>
              <p className="font-light mb-6">
                Someone wants to become an investor for this task.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-neutral-200 text-gray-800 rounded-full"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  onClick={async () => {
                    if (!contractOfTask) return
                    if (!address) return

                    const user = await getUserByWalletAddress({
                      walletAddress: address,
                    })
                    if (!user) return

                    const contractStarted = await startContract(
                      Address.parse(contractOfTask),
                    )
                    console.log(contractStarted, "contractStarted")

                    const investorAddress = await getData(
                      Address.parse(contractOfTask),
                    )
                    const investorAddressString =
                      investorAddress.investor.toString()

                    const startedWorkOnTask = await startWorkOnTask({
                      taskId: task.id,
                      investorWalletAddress: investorAddressString,
                      workerTgUsername: user.username,
                      investorTgUsername: telegramUsernameOfInvestor,
                      taskName: task.title,
                    })
                    console.log(startedWorkOnTask)

                    setShowModal(false)
                  }}
                >
                  Accept
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
