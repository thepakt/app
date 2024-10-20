import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { modalSpring } from "theme/transitions"

interface AddTodoProps {
  setIsNewTodoOpen: React.Dispatch<React.SetStateAction<boolean>>
  isNewTodoOpen: boolean
}

export default function AddTodoButton({
  setIsNewTodoOpen,
  isNewTodoOpen,
}: AddTodoProps) {
  const [isRotated, setIsRotated] = useState(false)

  useEffect(() => {
    setIsRotated(isNewTodoOpen)
  }, [isNewTodoOpen])

  return (
    <motion.div
      className="absolute p-2 right-2 bottom-2 flex items-center drop-shadow-lg justify-center text-white overflow-hidden rounded-[30px] bg-white/40 hover:bg-white/40 transition-colors"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={modalSpring}
      onClick={(e) => {
        setIsNewTodoOpen(true)
      }}
    >
      <motion.div className="relative z-10 w-full h-full flex items-center cursor-pointer justify-center">
        <PlusIcon size={28} />
      </motion.div>
    </motion.div>
  )
}
