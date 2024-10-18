import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { modalSpring } from "theme/transitions"
import { AddTodoVariants } from "theme/variants"

interface Todo {
  title: string
  bounty: number
  id: number
}

interface AddTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  todos: Todo[]
  setIsNewTodoOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddTodoButton({
  setTodos,
  todos,
  setIsNewTodoOpen,
}: AddTodoProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute flex items-center drop-shadow-lg justify-center text-white overflow-hidden rounded-[30px] bg-white/30"
        variants={AddTodoVariants}
        initial="closed"
        animate="closed"
        transition={modalSpring}
        onClick={() => setIsNewTodoOpen(true)}
      >
        <motion.div
          className="relative z-10 w-full h-full flex items-center cursor-pointer justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon size={28} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
