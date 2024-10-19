import { motion } from "framer-motion"
import Picker from "react-mobile-picker"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { useProxy } from "valtio/utils"
import { globalState } from "~/routes/__root"

type TimeUnit = "Hours" | "Days" | "Weeks" | "Months"

export default function NewTask({ onClose }: { onClose: () => void }) {
  const global = useProxy(globalState)

  const componentRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [bounty, setBounty] = useState("")
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [estimatedTimeOptions, setEstimatedTimeOptions] = useState<{
    amount: number[]
    unit: TimeUnit[]
  }>({
    amount: Array.from(Array(10).keys()).filter((el) => el),
    unit: ["Hours", "Days", "Weeks", "Months"],
  })
  const [estimatedTime, setEstimatedTime] = useState({
    amount: 1,
    unit: "Hours",
  })

  // Update amount array based on the chosen unit
  useEffect(() => {
    let newAmount: number[] = []

    switch (estimatedTimeOptions.unit[0]) {
      case "Hours":
        newAmount = Array.from({ length: 23 }, (_, i) => i + 1)
        break
      case "Days":
        newAmount = Array.from({ length: 20 }, (_, i) => i + 1)
        break
      case "Weeks":
        newAmount = Array.from({ length: 10 }, (_, i) => i + 1)
        break
      case "Months":
        newAmount = Array.from({ length: 12 }, (_, i) => i + 1)
        break
      default:
        newAmount = Array.from({ length: 10 }, (_, i) => i + 1)
        break
    }

    // Update the state with the new amount array
    setEstimatedTimeOptions((prev) => ({
      ...prev,
      amount: newAmount,
    }))
  }, [estimatedTimeOptions.unit])

  const handlePickerChange = (newValue: Partial<typeof estimatedTime>) => {
    console.log(newValue)
    // Update the state with the new value for amount or unit
    setEstimatedTime((prev) => ({
      ...prev,
      ...newValue,
    }))
  }

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
      // if (!me?.root) return
      e.preventDefault()
      global.user.tasks.push({
        // @ts-ignore
        title: title.trim(),
        // @ts-ignore
        notes: notes,
        // @ts-ignore
        subtasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        public: false,
        completed: false,
        id: crypto.randomUUID(),
      })
      // const t = Task.create(
      //   {
      //     title: title.trim(),
      //     notes: notes,
      //     subtasks: SubTaskList.create([], { owner: me }),
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //     public: false,
      //     completed: false,
      //   },
      //   { owner: me },
      // )
      // me.root.tasks.push(t)
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
      <div className="flex flex-col mb-2">
        <div className="flex flex-col gap-1">
          <span className="font-thin text-xs">Estimated time: </span>
          <Picker value={estimatedTime} onChange={handlePickerChange}>
            {Object.keys(estimatedTimeOptions).map((name) => (
              <Picker.Column key={name} name={name}>
                {estimatedTimeOptions[name].map((option) => (
                  <Picker.Item key={option} value={option}>
                    {option}
                  </Picker.Item>
                ))}
              </Picker.Column>
            ))}
          </Picker>
        </div>

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