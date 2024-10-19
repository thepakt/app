import { useQueryClient } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import Picker from "react-mobile-picker"
import { createTask } from "~/actions"

type TimeUnit = "Hours" | "Days"

export default function NewTask({ onClose }: { onClose: () => void }) {
  const address = useTonAddress()
  const queryClient = useQueryClient()
  const componentRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [bounty, setBounty] = useState("")
  const [estimatedTimeOptions, setEstimatedTimeOptions] = useState<{
    amount: number[]
    unit: TimeUnit[]
  }>({
    amount: Array.from(Array(10).keys()).filter((el) => el),
    unit: ["Hours", "Days"],
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

  // const handleAddTodo = async (e: React.KeyboardEvent<HTMLElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey && title.trim()) {
  //     if (e.target instanceof HTMLTextAreaElement) {
  //       return
  //     }
  //     if (!address) return
  //     e.preventDefault()
  //     const taskCreated = await createTask({
  //       task: {
  //         title: title.trim(),
  //         notes: notes,
  //         public: false,
  //         bountyEstimatedTimeInHours: estimatedTime.amount,
  //         bountyPriceInUSDT: Number(bounty),
  //       },
  //       userWalletAddress: address,
  //     })
  //     queryClient.invalidateQueries({
  //       queryKey: ["tasks"],
  //       refetchType: "all",
  //     })
  //     console.log(taskCreated, "task created")
  //     onClose()
  //   }
  // }

  return (
    <motion.div
      ref={componentRef}
      initial={{ opacity: 0, y: -20, height: 0, margin: "0" }}
      animate={{
        opacity: 1,
        y: 0,
        height: "auto",
        margin: "0 0 16px 0",
        padding: "16px",
      }}
      exit={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0 }}
      transition={{ type: "ease-in-out", duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg"
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
        <div className="flex flex-col gap-1">
          <span className="font-thin text-xs">Estimated time: </span>
          <Picker value={estimatedTime} onChange={handlePickerChange}>
            {Object.keys(estimatedTimeOptions).map((name) => (
              <Picker.Column key={name} name={name}>
                {/* @ts-ignore */}
                {estimatedTimeOptions[name].map((option) => (
                  <Picker.Item key={option} value={option}>
                    {option}
                  </Picker.Item>
                ))}
              </Picker.Column>
            ))}
          </Picker>
        </div>

        <div className="relative bg-white/10 rounded-xl px-3 py-1">
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

        <div className="pt-6">
          <button
            type="button"
            className="py-1 h-9 bg-white w-[100%] hover:opacity-45 transition-opacity text-black text-sm font-medium rounded-md"
            onClick={async () => {
              await createTask({
                task: {
                  title: title.trim(),
                  notes: notes,
                  public: false,
                  bountyEstimatedTimeInHours: estimatedTime.amount,
                  bountyPriceInUsdt: Number(bounty),
                },
                userWalletAddress: address,
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
