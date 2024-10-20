import { useQueryClient } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import Picker from "react-mobile-picker"
import { createTask } from "~/actions"
import { DatePicker } from "./DatePicker"

type TimeUnit = "Hours" | "Days"

export default function NewTask({
  onClose,
  showDatePicker,
  setShowDatePicker,
  date,
}: {
  onClose: () => void
  showDatePicker: boolean
  setShowDatePicker: (show: boolean) => void
  date: {
    amount: number
    type: string
  }
}) {
  const address = useTonAddress()
  const queryClient = useQueryClient()
  const componentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [bounty, setBounty] = useState("")
  const [subtasks, setSubtasks] = useState<string[]>([])
  const [estimatedTimeOptions, setEstimatedTimeOptions] = useState<{
    amount: number[]
    unit: TimeUnit[]
  }>({
    amount: Array.from(Array(10).keys()).filter((el) => el),
    unit: ["Hours", "Days"],
  })
  const [estimatedTimeInHours, setEstimatedTimeInHours] = useState({
    amount: 1,
    unit: "Hours",
  })

  useEffect(() => {
    let newAmount: number[] = []
    switch (estimatedTimeOptions.unit[0]) {
      case "Hours":
        newAmount = Array.from({ length: 23 }, (_, i) => i + 1)
        break
      case "Days":
        newAmount = Array.from({ length: 20 }, (_, i) => i + 1)
        break
    }
    setEstimatedTimeOptions((prev) => ({
      ...prev,
      amount: newAmount,
    }))
  }, [estimatedTimeOptions.unit])

  const handlePickerChange = (
    newValue: Partial<typeof estimatedTimeInHours>,
  ) => {
    // Update the state with the new value for amount or unit
    setEstimatedTimeInHours((prev) => ({
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
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          onClose()
        }, 0)
      }
    }

    document.addEventListener("mousedown", clickOutside)
    return () => {
      document.removeEventListener("mousedown", clickOutside)
      // Clear timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onClose])

  return (
    <motion.div
      ref={componentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      className="bg-white/10 p-4 backdrop-blur-md rounded-xl shadow-lg"
    >
      <input
        type="text"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent outline-none text-md font-light mb-2"
        placeholder="New Task"
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
        {/* no subtasks for now */}
        {/* <span className="font-thin text-xs mb-1">Subtasks:</span>
        {subtasks.map((subtask, index) => (
          <div key={index} className="flex items-center mb-1">
            <input
              type="text"
              value={subtask}
              onChange={(e) => {
                const newSubtasks = [...subtasks]
                newSubtasks[index] = e.target.value
                setSubtasks(newSubtasks)
              }}
              className="flex-grow bg-white/10 rounded-xl px-3 py-1 text-sm outline-none"
            />
            <button
              onClick={() =>
                setSubtasks(subtasks.filter((_, i) => i !== index))
              }
            >
              remove
            </button>
          </div>
        ))} */}
        {/* <button
          onClick={() => setSubtasks([...subtasks, ""])}
          className="items-start mt-1"
        >
          Add
        </button> */}
        <h2>Estimated time:</h2>
        <div className="flex items-center gap-2 h-[44px]">
          {date && (
            <div className="w-full bg-neutral-700 items-center justify-center rounded-md h-full px-3 flex">
              {date.amount} {date.type}
            </div>
          )}
          <button
            onClick={() => setShowDatePicker(true)}
            className="w-full min-w-[120px] rounded-md h-full p-2 bg-blue-500"
          >
            Pick time
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-2">
        {/* <div className="flex flex-col gap-1">
          <span className="font-thin text-xs">Estimated time: </span>
          <Picker value={estimatedTimeInHours} onChange={handlePickerChange}>
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
        </div> */}

        <div className="relative bg-white/10 h-[44px] rounded-md px-3 py-2">
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
            className="w-[100%] bg-transparent outline-none text-sm pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Amount"
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="py-1 h-[44px] bg-white w-[100%] hover:opacity-45 transition-opacity text-black text-sm font-medium rounded-md"
            onClick={async () => {
              await createTask({
                task: {
                  title: title.trim(),
                  notes: notes,
                  public: false,
                  bountyEstimatedTimeInHours: estimatedTimeInHours.amount,
                  bountyPriceInUsdt: Number(bounty),
                },
                userWalletAddress: address,
                subtasks,
              })
              queryClient.invalidateQueries({
                queryKey: ["tasks"],
                refetchType: "all",
              })
              onClose()
            }}
          >
            Create task
          </button>
        </div>
      </div>
    </motion.div>
  )
}
