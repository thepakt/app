import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { useAccount } from "~/lib/providers/jazz-provider"
import { SubTaskList, Task } from "~/lib/schema/task"

export default function NewTodo({ onClose }: { onClose: () => void }) {
  const { me } = useAccount({ root: { tasks: [] } })
  console.log(me, "me")

  const componentRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [bounty, setBounty] = useState("")
  const [dueDate, setDueDate] = useState<Date | null>(null)

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", clickOutside)
    return () => {
      document.removeEventListener("mousedown", clickOutside)
    }
  }, [onClose])

  const handleAddTodo = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !e.shiftKey && title.trim()) {
      if (e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (!me?.root) return
      e.preventDefault()
      const t = Task.create(
        {
          title: title.trim(),
          notes: notes,
          subtasks: SubTaskList.create([], { owner: me }),
          createdAt: new Date(),
          updatedAt: new Date(),
          public: false,
          completed: false,
        },
        { owner: me },
      )
      me.root.tasks.push(t)
      onClose()
    }
  }

  return (
    <motion.div
      ref={componentRef}
      onKeyDown={handleAddTodo}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-lg"
    >
      <input
        type="text"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent outline-none text-md font-light mb-2"
        placeholder="New Todo Title"
      />
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value)
          e.target.style.height = "auto"
          e.target.style.height = e.target.scrollHeight + "px"
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            setNotes(notes + "\n")
          }
        }}
        className="w-full bg-transparent outline-none text-sm font-light pb-[2em] resize-none overflow-hidden mb-2"
        placeholder="Notes"
      />
      <div className="flex flex-row items-center justify-between mb-2">
        <div className="flex flex-col gap-1">
          <span className="font-thin text-xs">Estimated time: </span>
          <input className="outline-none rounded-sm bg-white/10 p-2 py-5 text-sm w-full" />
        </div>

        {/* <div className="relative w-[50%] bg-white/10 rounded-xl px-3 py-1"> */}

        {/* <DatePicker
            selected={dueDate}
            onChange={(date: Date | null) => setDueDate(date)}
            className="bg-transparent outline-none text-sm w-full"
            placeholderText="Due date"
            dateFormat="dd/MM/yyyy"
          />
          <button
            onClick={() => setDueDate(null)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            🗓️
          </button> */}
        {/* </div> */}
        <div className="relative w-[30%] bg-white/10 rounded-xl px-3 py-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={bounty}
            onChange={(e) => {
              const value = e.target.value
              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                setBounty(value)
              }
            }}
            className="w-20 bg-transparent outline-none text-sm pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Amount"
          />
        </div>
      </div>
    </motion.div>
  )
}
