import { motion, AnimatePresence } from "framer-motion"
import { Circle } from "lucide-react"
import { useEffect, useState } from "react"

interface TodoProps {
  id: number
  title: string
  notes?: string
  estimatedTime?: string
  bounty: number
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
        <motion.div className="flex items-center gap-4" layout="position">
          <Circle className="w-6 h-6" />
          {isExpanded ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-grow bg-transparent text-md font-light outline-none focus:border-white/50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-grow text-md font-light">{title}</span>
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
                <span className="text-gray-400 mb-1">Notes</span>
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="bg-inherit p-2 outline-none focus:ring-none"
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Estimated Time:</span>
                <input
                  type="text"
                  value={editedEstimatedTime}
                  onChange={(e) => setEditedEstimatedTime(e.target.value)}
                  className="bg-white/5 rounded-lg p-2 w-32 text-right outline-none focus:ring-2 focus:ring-white/20 transition-shadow"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bounty:</span>
                <input
                  type="number"
                  value={editedBounty}
                  onChange={(e) => setEditedBounty(Number(e.target.value))}
                  className="bg-white/5 rounded-lg p-2 w-32 text-right outline-none focus:ring-2 focus:ring-white/20 transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Todo
