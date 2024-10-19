import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export const TodoItem = ({ todo }: { todo: any }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.li
      onClick={() => setIsExpanded(!isExpanded)}
      className="flex flex-col cursor-pointer bg-neutral-700/40 p-3 rounded-md overflow-hidden"
    >
      <motion.div className="flex items-center gap-4 justify-between">
        <div className="flex gap-2 overflow-hidden items-center">
          <span className="min-w-[16px] transition-all w-[16px] h-[16px] border-white border-2 rounded-full flex-shrink-0"></span>
          <p
            className={`text-sm overflow-hidden ${
              isExpanded
                ? /* Adding witespace-normal lets you see title but gives a weird animation */
                  "whitespace-nowrap overflow-ellipsis"
                : "whitespace-nowrap overflow-ellipsis"
            }`}
          >
            {todo.title}
          </p>
        </div>
        <div className="px-3 p-1 text-[12px] bg-neutral-700 rounded-md">
          {todo.bounty}
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-6 mt-2 text-xs text-gray-400"
          >
            <p className="text-[12px]">{todo.description}</p>
            <div className="flex justify-end mt-4">
              <p className="">{todo.date}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}
