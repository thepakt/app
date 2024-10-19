import { AnimatePresence, motion } from "framer-motion"
import { ID } from "jazz-tools"
import { Circle } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"
import { Task } from "~/lib/schema/task"

export function TaskComponent({
  task,
  isExpanded,
  onClick,
}: {
  task: Task
  isExpanded: boolean
  onClick: (taskId: ID<Task>) => void
}) {
  const truncateNotes = (notes: string) => {
    const lines = notes.split("\n")
    if (lines.length > 10) {
      return lines.slice(0, 10).join("\n") + "\n..."
    }
    return notes
  }

  return (
    <motion.div
      layout
      onClick={() => {
        onClick(task.id)
      }}
      className={`todo-item p-4 rounded-2xl text-white font-medium cursor-pointer ${
        isExpanded ? "bg-white/10 backdrop-blur-md" : "bg-white/5"
      } transition-colors duration-300 ease-in-out hover:bg-white/15`}
      initial={false}
      animate={{ height: "auto" }}
    >
      <div className="flex flex-col">
        <motion.div className="flex items-start gap-4" layout="position">
          <Circle className="w-4 h-4 flex-shrink-0 mt-1" />
          {isExpanded ? (
            <textarea
              value={task.title}
              onChange={(e) => {
                task.title = e.target.value
              }}
              className="flex-grow bg-transparent text-md scrollbar-hide h-full font-light outline-none focus:border-white/50 transition-colors resize-none w-full"
              onClick={(e) => e.stopPropagation()}
              rows={task.title.split("\n").length}
              style={{ minHeight: "1.5em" }}
            />
          ) : (
            <div className="flex-grow text-md font-light truncate">
              {task.title}
            </div>
          )}
        </motion.div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col mt-6 text-sm space-y-4"
            >
              <div className="flex flex-col">
                <span className="text-gray-400 font-light mb-1">Notes</span>
                <textarea
                  value={truncateNotes(task.notes || "")}
                  autoFocus
                  onChange={(e) => {
                    task.notes = e.target.value
                  }}
                  className="bg-inherit font-normal p-2 outline-none focus:ring-none scrollbar-hide"
                  rows={Math.min(10, task.notes?.split("\n").length || 0)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-[50%] bg-white/10 rounded-xl px-3 py-1">
                  {/* TODO: should be hour / day picker */}
                  {/* <DatePicker
                    selected={task.dueDate}
                    // onChange={(date: Date | null) => setDueDate(date)}
                    className="bg-transparent outline-none text-sm w-full"
                    placeholderText="Due date"
                    dateFormat="dd/MM/yyyy"
                  /> */}
                  <button
                    // onClick={() => setDueDate(null)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    🗓️
                  </button>
                </div>
                <div className="flex-1 bg-white/10 rounded-lg p-2 flex items-center">
                  <span className="text-gray-400 mr-2">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={task.bountyPriceInUSDT || ""}
                    onChange={(e) => {
                      e.stopPropagation()
                      task.bountyPriceInUSDT = Number(e.target.value)
                      const value = e.target.value
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        task.bountyPriceInUSDT = Number(e.target.value)
                      }
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent w-full outline-none"
                    placeholder="Amount"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
