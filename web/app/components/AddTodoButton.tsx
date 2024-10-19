import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { modalSpring } from "theme/transitions"
import { AddTodoVariants } from "theme/variants"
import { useAccount } from "~/lib/providers/jazz-provider"

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

  const handleClick = () => {
    setIsNewTodoOpen((prev) => !prev)
    setIsRotated((prev) => !prev)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="absolute flex items-center drop-shadow-lg justify-center text-white overflow-hidden rounded-[30px] bg-white/30 hover:bg-white/40 transition-colors"
        variants={AddTodoVariants}
        initial="closed"
        animate="closed"
        transition={modalSpring}
        onClick={handleClick}
      >
        <motion.div
          className="relative z-10 w-full h-full flex items-center cursor-pointer justify-center"
          initial={{ opacity: 1, rotate: 0 }}
          animate={{ opacity: 1, rotate: isRotated ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlusIcon size={28} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
