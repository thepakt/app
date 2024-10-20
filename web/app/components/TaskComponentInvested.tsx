import { Task } from "@ronin/todo-escrow"
import { useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { FlagOff, Sticker } from "lucide-react"
import { useState } from "react"
import useActions from "~/lib/investor/useActions"

export function TaskComponentInvested({
  task,
  isExpanded,
  onClick,
  showNotification,
  contractOfTask,
}: {
  task: Task
  isExpanded: boolean
  onClick: (taskId: string) => void
  showNotification?: boolean
  contractOfTask?: string
}) {
  const { startContract } = useActions()
  const [waitingForTransaction, setWaitingForTransaction] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()
  const [conflictClicked, setConflictClicked] = useState(false)
  const [taskCompleted, setTaskCompleted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const handleTaskCompleted = async () => {
    setTaskCompleted(true)
    console.log("Task Completed")

    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  return (
    isVisible && (
      <motion.div
        layout
        onClick={() => {
          onClick(task.id)
        }}
        initial={{ opacity: 1, x: 0 }}
        animate={{
          opacity: taskCompleted ? 0 : 1,
          x: taskCompleted ? -100 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`rounded-3xl rounded-tl-[50px] p-5 mb-3 w-full max-w-2xl mx-auto relative ${taskCompleted ? "bg-green-500" : conflictClicked ? "bg-gradient-to-r from-black to-red-800/50 border border-red-500" : "bg-black/30"}`}
      >
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

        <>
          <p className="text-sm">Notes</p>
          <p className="text-white/50 text-xs mb-4">notes</p>
        </>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-1 flex-col">
            <h2 className="text-white text-sm">Bounty:</h2>
            <p className="text-white/50 text-xs">bounty</p>
          </div>
          <div className="flex items-end gap-1 flex-col">
            <h2 className="text-white text-sm">Estimated time:</h2>
            <p className="text-white/50 text-xs">time</p>
          </div>
        </div>

        <div className="flex gap-2">
          {conflictClicked ? (
            <div className="flex flex-row gap-3 items-center">
              <button className="flex items-center p-2 gap-1 bg-gradient-to-r from-red-500/20 to-red-700 hover:bg-red-600 transition-all justify-center rounded-lg w-full">
                <FlagOff className="text-white" size={16} />
                <span className="text-[14px] text-center">
                  Conflict started. Please wait for a moderator.
                </span>
              </button>
              <button
                onClick={() => {
                  setConflictClicked(false)
                }}
                className="text-xs p-2 py-3 rounded-lg bg-black/30"
              >
                Cancel Conflict
              </button>
            </div>
          ) : (
            <>
              {!taskCompleted && (
                <>
                  <button
                    className="flex items-center p-2 gap-1 bg-gradient-to-r from-red-500/20 to-red-700 hover:bg-red-600 transition-all justify-center rounded-lg w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setConflictClicked(true)
                    }}
                  >
                    <FlagOff className="text-white" size={16} />
                    <span className="text-[14px] text-center">Conflict</span>
                  </button>
                </>
              )}
              <button
                className="flex items-center p-2 gap-1 bg-gradient-to-r from-green-500/20 to-green-700 hover:bg-green-600 transition-all justify-center rounded-lg w-full"
                onClick={handleTaskCompleted}
              >
                <Sticker className="text-white" size={16} />
                <span className="text-[14px] text-center">Task Completed</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    )
  )
}

// import { Task } from "@ronin/todo-escrow"
// import { useQueryClient } from "@tanstack/react-query"
// import { Address } from "@ton/core"
// import { AnimatePresence, motion } from "framer-motion"
// import { Bell, Share, Trash, X } from "lucide-react"
// import { useState } from "react"
// import { deleteTask } from "~/actions"
// import useActions from "~/lib/investor/useActions"

// export function TaskComponentInvested({
//   task,
//   isExpanded,
//   onClick,
//   showNotification,
//   contractOfTask,
// }: {
//   task: Task
//   isExpanded: boolean
//   onClick: (taskId: string) => void
//   showNotification?: boolean
//   contractOfTask?: string
// }) {
//   const { startContract } = useActions()
//   const [waitingForTransaction, setWaitingForTransaction] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const queryClient = useQueryClient()

//   return (
//     <motion.div
//       layout
//       onClick={() => {
//         onClick(task.id)
//       }}
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="bg-black/30 rounded-3xl rounded-tl-[50px] p-5 mb-3 w-full max-w-2xl mx-auto relative"
//     >
//       {showNotification && (
//         <div
//           className="absolute top-2 right-2 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center transform cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation()
//             setShowModal(true)
//           }}
//         >
//           <Bell size={12} />
//         </div>
//       )}
//       <div className="flex items-center justify-between mb-4">
//         {waitingForTransaction && (
//           <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black/30 z-50">
//             <div className="h-[60px] w-[60px] animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
//           </div>
//         )}
//         <div className="flex items-center">
//           <div className="w-[50px] h-[50px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
//           <div className="ml-3">
//             <h2 className="text-white font-semibold">{task.title}</h2>
//             <p className="text-gray-400 text-sm"></p>
//           </div>
//         </div>
//       </div>

//       {task.notes && (
//         <>
//           <p className="text-sm">Notes</p>
//           <p className="text-white/50 text-xs mb-4">{task.notes}</p>
//         </>
//       )}

//       <div className="flex justify-between items-center mb-4">
//         <div className="flex gap-1 flex-col">
//           <h2 className="text-white text-sm">Bounty:</h2>
//           <p className="text-white/50 text-xs">{task.bountyPriceInUsdt}$</p>
//         </div>
//         <div className="flex items-end gap-1 flex-col">
//           <h2 className="text-white text-sm">Estimated time:</h2>
//           <p className="text-white/50 text-xs">
//             {task.bountyEstimatedTimeInHours}{" "}
//             {task.bountyEstimatedTimeInHours === 1 ? "hour" : "hours"}
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <button className="flex items-center p-2 gap-1 bg-neutral-700/40 hover:bg-neutral-700 transition-all justify-center rounded-lg w-full">
//           <span className="text-[14px] text-center">Conflict</span>
//         </button>
//         <button
//           className="flex items-center p-2 gap-1 justify-center hover:bg-neutral-700 transition-all rounded-lg w-full bg-neutral-700/40"
//           onClick={async () => {
//             console.log("Task Completed")
//           }}
//         >
//           <span className="text-[14px] text-center">Task Completed</span>
//         </button>
//       </div>
//     </motion.div>
//   )
// }
