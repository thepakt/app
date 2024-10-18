import { motion } from "framer-motion"
import { useState } from "react"

interface NewTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  onClose: () => void
}

export default function NewTodo({ setTodos, onClose }: NewTodoProps) {
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
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
        className="w-full bg-transparent outline-none text-md font-light"
        placeholder="New Todo Title"
      />
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value)
          e.target.style.height = "auto"
          e.target.style.height = e.target.scrollHeight + "px"
        }}
        className="w-full bg-transparent outline-none text-sm font-light pb-[2em] resize-none overflow-hidden"
        placeholder="Notes"
      />
      <div className="flex flex-col items-start mb-4">
        <span className="text-gray-400">Due date:</span>
        <input
          type="number"
          value={bounty}
          onChange={(e) => setBounty(Number(e.target.value))}
          className="w-[15%] bg-white/30 rounded-xl px-3 text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
