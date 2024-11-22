import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { modalSpring } from "theme/transitions"
import { Tooltip } from "./ui"
import { useRouter } from "@tanstack/react-router"

interface AddTodoProps {
  setIsNewTodoOpen: React.Dispatch<React.SetStateAction<boolean>>
  isNewTodoOpen: boolean
  isLoggedIn: boolean
}

export default function AddTodoButton({
  setIsNewTodoOpen,
  isNewTodoOpen,
  isLoggedIn,
}: AddTodoProps) {
  const [isRotated, setIsRotated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsRotated(isNewTodoOpen)
  }, [isNewTodoOpen])

  const handleClick = () => {
    if (isLoggedIn) setIsNewTodoOpen(true)
    else router.commitLocation({...router.state.location, href: "/connect?from=/tasks?create"})
  }

  return (
    <motion.div
      className="absolute p-2 right-2 bottom-0 flex items-center drop-shadow-lg justify-center text-white overflow-hidden rounded-[30px] bg-white/40 hover:bg-white/40 transition-colors"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={modalSpring}
      onClick={() => handleClick()}
    >
      <motion.div className="relative z-10 w-full h-full flex items-center cursor-pointer justify-center">
        <PlusIcon size={28} />
      </motion.div>
    </motion.div>
  )
}
