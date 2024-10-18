import { motion } from "framer-motion"
import { useState } from "react"
import Todo from "./Todo"

interface NewTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  onClose: () => void
}

export default function NewTodo({ setTodos, onClose }: NewTodoProps) {
  const [title, setTitle] = useState("")
  const [bounty, setBounty] = useState(100)

  const handleAddTodo = () => {
    if (title.trim()) {
      setTodos((prevTodos) => [
        {
          id: Date.now(),
          title: title.trim(),
          bounty: bounty,
        },
        ...prevTodos,
      ])
      onClose()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-xl"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border-b border-white/30 outline-none text-lg font-semibold mb-4"
        placeholder="New Todo Title"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-400">Bounty:</span>
        <input
          type="number"
          value={bounty}
          onChange={(e) => setBounty(Number(e.target.value))}
          className="w-20 bg-white/20 rounded-full px-3 py-1 text-right outline-none"
        />
      </div>

      <button
        onClick={handleAddTodo}
        className="px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
      >
        Add Todo
      </button>
    </motion.div>
  )
}
