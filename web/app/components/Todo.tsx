import { motion, AnimatePresence } from "framer-motion"
import { SquareIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { modalSpring } from "theme/transitions"

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
      className={`todo-item p-2 pl-3 rounded-lg text-neutral-700 font-medium cursor-pointer overflow-hidden ${
        isExpanded ? "bg-white" : "bg-transparent"
      }`}
      initial={false}
      animate={{
        height: isExpanded ? "200px" : "40px",
        scale: isExpanded ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 1,
      }}
    >
      <div className="flex flex-col h-full">
        <motion.div
          className="flex gap-1 items-center pb-0.5 h-[36px] flex-shrink-0"
          layout="position"
        >
          <SquareIcon size={18} />
          <h3 className="truncate pb-0.5">{title}</h3>
        </motion.div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.3,
              }}
              className="flex flex-col flex-grow justify-between items-between text-[14px] font-normal gap-2 p-2"
            >
              <p className="">Something something...</p>
              <motion.div
                className="bg-primary-500 h-[30px] items-center max-w-full w-fit flex gap-1 self-end rounded-md overflow-hidden"
                animate={{
                  width: isBountyExpanded
                    ? "300px"
                    : bounty
                      ? "fit-content"
                      : "120px",
                }}
              >
                <AnimatePresence>
                  {!isBountyExpanded && (
                    <motion.div
                      className="bg-primary-500 uppercase font-semibold min-w-fit flex items-center justify-center text-white rounded-md px-3 p-1 text-[12px]"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsBountyExpanded(true)
                      }}
                    >
                      {bounty ? `${bounty}$` : "set bounty"}
                    </motion.div>
                  )}
                </AnimatePresence>
                {isBountyExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className=" flex items-center justify-between w-full h-full p-0.5 pl-3"
                  >
                    {" "}
                    <input
                      type="number"
                      autoFocus
                      className="w-full placeholder-white outline-none h-full text-[12px] bg-transparent text-white rounded"
                      placeholder="Enter bounty amount"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsBountyExpanded(false)
                      }}
                      className="bg-white text-black font-medium rounded-md px-4 py-1 text-[12px]"
                    >
                      SET
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default Todo
