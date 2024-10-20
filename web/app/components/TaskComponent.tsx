import { Task } from "@ronin/todo-escrow"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Bell, Share, Trash, X } from "lucide-react"

export function TaskComponent({
  task,
  isExpanded,
  onClick,
  notifications = 1,
}: {
  task: Task
  isExpanded: boolean
  onClick: (taskId: string) => void
  notifications?: number
}) {
  const [waitingForTransaction, setWaitingForTransaction] = useState(false)
  const [showModal, setShowModal] = useState(false)

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
      {notifications > 0 && (
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
            <p className="text-gray-400 text-sm">
              {/* Add handle or username if available */}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm">Notes</p>
      <p className="text-white/50 text-xs mb-4">{task.notes}</p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 flex-col">
          <h2 className="text-white text-sm">Bounty:</h2>
          <p className="text-white/50 text-xs">{task.bountyPriceInUSDT}$</p>
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
          <Share className="w-3 h-3" />
          <span className="text-[10px] text-center">Share</span>
        </button>
        <button className="flex items-center p-2 gap-1 justify-center hover:bg-neutral-700 transition-all rounded-lg w-full bg-neutral-700/40">
          <Trash className="w-3 h-3" />
          <span className="text-[10px] text-center">Delete</span>
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/80 dark:bg-neutral-600/80 backdrop-blur-md p-6 rounded-2xl shadow-lg relative max-w-sm w-full mx-4"
            >
              <button
                className="absolute top-4 right-4 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
              <h3 className="text-md font-normal mb-4">New Investor Request</h3>
              <p className="font-light mb-6">
                @Someone wants to become an investor for this task.
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
                  onClick={() => {
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

// export function TaskComponent({
//   task,
//   isExpanded,
//   onClick,
//   notifications = 1,
// }: {
//   task: Task
//   isExpanded: boolean
//   onClick: (taskId: string) => void
//   notifications?: number
// }) {
//   const [isEditingTime, setIsEditingTime] = useState(false)
//   const [estimatedTime, setEstimatedTime] = useState({
//     amount: task.bountyEstimatedTimeInHours || 1,
//     unit: "Hours",
//   })
//   const [estimatedTimeOptions, setEstimatedTimeOptions] = useState({
//     amount: Array.from({ length: 23 }, (_, i) => i + 1),
//     unit: ["Hours", "Days"],
//   })
//   const [showModal, setShowModal] = useState(false)

//   const handlePickerChange = (newValue: Partial<typeof estimatedTime>) => {
//     setEstimatedTime((prev) => ({
//       ...prev,
//       ...newValue,
//     }))
//     // Update the task
//     if (newValue.amount) {
//       task.bountyEstimatedTimeInHours = newValue.amount
//     }
//   }
//   const truncateNotes = (notes: string) => {
//     const lines = notes.split("\n")
//     if (lines.length > 10) {
//       return lines.slice(0, 10).join("\n") + "\n..."
//     }
//     return notes
//   }

//   return (
//     <motion.div
//       layout
//       onClick={() => {
//         onClick(task.id)
//       }}
//       className={`todo-item p-4 rounded-2xl text-white font-medium cursor-pointer ${
//         isExpanded ? "bg-white/10 backdrop-blur-md" : "bg-white/5"
//       } transition-colors duration-300 ease-in-out hover:bg-white/15 relative`}
//       initial={false}
//       animate={{ height: "auto" }}
//     >
//       {notifications > 0 && (
//         <div
//           className="absolute top-0 right-0 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation()
//             setShowModal(true)
//           }}
//         >
//           <Bell size={12} />
//         </div>
//       )}
//       <div className="flex flex-col">
//         <motion.div className="flex items-start gap-4" layout="position">
//           <Circle className="w-4 h-4 flex-shrink-0 mt-1" />
//           {isExpanded ? (
//             <textarea
//               value={task.title}
//               onChange={(e) => {
//                 // @ts-ignore
//                 task.title = e.target.value
//               }}
//               className="flex-grow bg-transparent text-md scrollbar-hide h-full font-light outline-none focus:border-white/50 transition-colors resize-none w-full"
//               onClick={(e) => e.stopPropagation()}
//               rows={task.title.split("\n").length}
//               style={{ minHeight: "1.5em" }}
//             />
//           ) : (
//             <div className="flex-grow text-md font-light truncate">
//               {task.title}
//             </div>
//           )}
//         </motion.div>
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ delay: 0.1 }}
//               className="flex flex-col mt-6 text-sm space-y-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex flex-col">
//                 <span className="text-gray-400 font-light mb-1">Notes</span>
//                 <textarea
//                   value={truncateNotes(task.notes || "")}
//                   autoFocus
//                   onChange={(e) => {
//                     // @ts-ignore
//                     task.notes = e.target.value
//                   }}
//                   className="bg-inherit font-normal p-2 outline-none focus:ring-none scrollbar-hide"
//                   // @ts-ignore
//                   rows={Math.min(10, task.notes?.split("\n").length || 0)}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               </div>
//               {/* <div className="flex flex-col">
//                 <span className="text-gray-400 font-light mb-1">Subtasks</span>
//                 {task.subtasks.map((subtask, index) => (
//                   <div key={index} className="flex items-center mb-1">
//                     <input
//                       type="checkbox"
//                       checked={subtask.completed}
//                       onChange={() => {
//                         subtask.completed = !subtask.completed
//                       }}
//                       className="mr-2"
//                     />
//                     <input
//                       type="text"
//                       value={subtask.title}
//                       onChange={(e) => {
//                         subtask.title = e.target.value
//                       }}
//                       className="bg-inherit font-normal p-2 outline-none focus:ring-none scrollbar-hide flex-grow"
//                     />
//                   </div>
//                 ))}
//                 <button
//                   onClick={() => {
//                     task.subtasks.push({ title: "", completed: false })
//                     You might want to add a function to update the task on the server here
//                   }}
//                   className="text-blue-500 text-sm mt-1"
//                 >
//                   Add Subtask
//                 </button>
//               </div> */}
//               <div>
//                 <span className="text-gray-400 mr-2">$</span>
//                 <input
//                   type="number"
//                   inputMode="decimal"
//                   value={task.bountyPriceInUSDT || ""}
//                   onChange={(e) => {
//                     e.stopPropagation()
//                     // @ts-ignore
//                     task.bountyPriceInUSDT = Number(e.target.value)
//                     const value = e.target.value
//                     if (value === "" || /^\d*\.?\d*$/.test(value)) {
//                       // @ts-ignore
//                       task.bountyPriceInUSDT = Number(e.target.value)
//                     }
//                   }}
//                   onFocus={(e) => e.stopPropagation()}
//                   onClick={(e) => e.stopPropagation()}
//                   className="bg-transparent w-full outline-none"
//                   placeholder="Amount"
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <span
//                   className="text-gray-400 font-light mb-1 cursor-pointer"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     setIsEditingTime(!isEditingTime)
//                   }}
//                 >
//                   Estimated time: {estimatedTime.amount} {estimatedTime.unit}
//                 </span>
//                 {isEditingTime && (
//                   <div onClick={(e) => e.stopPropagation()}>
//                     <Picker
//                       value={estimatedTime}
//                       onChange={handlePickerChange}
//                       height={150}
//                     >
//                       {Object.keys(estimatedTimeOptions).map((name) => (
//                         <Picker.Column key={name} name={name}>
//                           {estimatedTimeOptions[
//                             name as keyof typeof estimatedTimeOptions
//                           ].map((option) => (
//                             <Picker.Item key={option.toString()} value={option}>
//                               {option.toString()}
//                             </Picker.Item>
//                           ))}
//                         </Picker.Column>
//                       ))}
//                     </Picker>
//                   </div>
//                 )}
//               </div>
//               <div className="flex items-center space-x-2"></div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   console.log("Delete task:", task.id)
//                 }}
//                 className="self-end flex flex-row gap-2 items-center mt-4 px-4 py-2 bg-red-500/30 text-white rounded-full hover:bg-red-500/50 transition-colors"
//               >
//                 <X className="size-3" />
//                 delete task
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               className="bg-white/80 dark:bg-neutral-600/80 backdrop-blur-md p-6 rounded-2xl shadow-lg relative max-w-sm w-full mx-4"
//             >
//               <button
//                 className="absolute top-4 right-4  transition-colors"
//                 onClick={() => setShowModal(false)}
//               >
//                 <X size={24} />
//               </button>
//               <h3 className="text-md font-normal mb-4">New Investor Request</h3>
//               <p className="font-light mb-6">
//                 @Someone wants to become an investor for this task.
//               </p>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   className="px-4 py-2 bg-neutral-200 text-gray-800 rounded-full "
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//                   onClick={() => {
//                     setShowModal(false)
//                   }}
//                 >
//                   Accept
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }
