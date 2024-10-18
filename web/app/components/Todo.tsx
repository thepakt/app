import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"
import { useEffect, useState } from "react"

interface TodoProps {
  id: number
  title: string
  bounty: number
  isExpanded: boolean
  onClick: () => void
}

const Todo: React.FC<TodoProps> = ({
  id,
  title,
  bounty,
  isExpanded,
  onClick,
}) => {
  const [isBountyExpanded, setIsBountyExpanded] = useState(false)

  useEffect(() => {
    if (!isExpanded) {
      setIsBountyExpanded(false)
    }
  }, [isExpanded])

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`todo-item p-4 rounded-xl text-white font-medium cursor-pointer overflow-hidden ${
        isExpanded ? "bg-white/10 backdrop-blur-md" : "bg-white/5"
      }`}
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
        <motion.div className="flex items-center gap-3" layout="position">
          <Circle className="text-gray-400" size={24} />

          <h3 className="text-lg font-semibold truncate">{title}</h3>
        </motion.div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col mt-4 text-sm"
            >
              <p className="opacity-50 mb-4">Something something...</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bounty:</span>
                <motion.div
                  className="bg-white/20 rounded-full overflow-hidden"
                  animate={{
                    width: isBountyExpanded ? "100px" : "auto",
                  }}
                >
                  {isBountyExpanded ? (
                    <div className="flex flex-row gap-1 items-center w-full bg-transparent pr-3 py-1">
                      {/* <span className="text-gray-400">$</span> */}
                      <input
                        type="number"
                        className="w-full bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pl-0"
                        defaultValue={bounty}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsBountyExpanded(true)
                        }}
                      />
                    </div>
                  ) : (
                    <span
                      className="px-3 py-1 block"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsBountyExpanded(true)
                      }}
                    >
                      ${bounty}
                    </span>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Todo
