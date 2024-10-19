import { motion, AnimatePresence } from "framer-motion"
import { Circle } from "lucide-react"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface TodoProps {
  id: number
  title: string
  notes?: string
  estimatedTime?: string
  bounty: number
  dueDate?: Date | null
  isExpanded: boolean
  onClick: () => void
  onUpdate: (id: number, updates: Partial<TodoProps>) => void
}

const Todo: React.FC<TodoProps> = ({
  id,
  title,
  notes,
  estimatedTime,
  bounty,
  dueDate,
  isExpanded,
  onClick,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isBountyExpanded, setIsBountyExpanded] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedNotes, setEditedNotes] = useState(notes || "")
  const [editedEstimatedTime, setEditedEstimatedTime] = useState(
    estimatedTime || "",
  )
  const [editedBounty, setEditedBounty] = useState(bounty)
  const [editedDueDate, setEditedDueDate] = useState<Date | null>(
    dueDate || null,
  )

  useEffect(() => {
    if (!isExpanded) {
      setIsBountyExpanded(false)
      handleSave()
    }
  }, [isExpanded])

  const handleSave = () => {
    if (isExpanded) {
      onUpdate(id, {
        title: editedTitle,
        notes: editedNotes,
        estimatedTime: editedEstimatedTime,
        bounty: editedBounty,
        dueDate: editedDueDate,
      })
    }
  }

  return (
    <motion.div
      layout
      onClick={isEditing ? undefined : onClick}
      className={`todo-item p-4 rounded-2xl text-white font-medium cursor-pointer overflow-hidden ${
        isExpanded ? "bg-white/10 backdrop-blur-md" : "bg-white/5"
      } transition-colors duration-300 ease-in-out hover:bg-white/15`}
      initial={false}
      animate={{
        height: isExpanded ? "auto" : "60px",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      }}
    >
      <div className="flex flex-col h-full">
        <motion.div
          className="flex items-center gap-4 h-[36px]"
          layout="position"
        >
          <Circle className="w-6 h-6 flex-shrink-0" />
          {isExpanded ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-grow bg-transparent text-md font-light outline-none focus:border-white/50 transition-colors overflow-hidden text-ellipsis"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-grow text-md font-light overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </span>
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
                  value={editedNotes}
                  autoFocus
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="bg-inherit font-normal p-2 outline-none focus:ring-none"
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-[50%] bg-white/10 rounded-xl px-3 py-1">
                  <DatePicker
                    selected={dueDate}
                    // onChange={(date: Date | null) => setDueDate(date)}
                    className="bg-transparent outline-none text-sm w-full"
                    placeholderText="Due date"
                    dateFormat="dd/MM/yyyy"
                  />
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
                    value={editedBounty || ""}
                    onChange={(e) => {
                      e.stopPropagation()
                      setEditedBounty(Number(e.target.value))
                      handleSave()
                      const value = e.target.value
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setEditedBounty(Number(e.target.value))
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

export default Todo
