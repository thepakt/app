import { useQueryClient } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { createTask } from "~/actions"
import { ChevronDown } from "lucide-react"

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

  const [isPublic, setIsPublic] = useState(true)
  const [isOpensource, setIsOpensourse] = useState(false)
  const [isCrowdfunding, setIsCrowdfunding] = useState<boolean>(false)

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
    setEstimatedTimeInHours((prev) => ({
      ...prev,
      ...newValue,
    }))
  }

  useEffect(() => {
    const clickOutside = (event: MouseEvent) => {
      if (showDatePicker) return
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [onClose])

  return (
    <div className="sticky flex items-start w-full max-w-50 justify-center z-30 p-4">
      <motion.div
        ref={componentRef}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20,
          transition: {
            duration: 0.2,
          },
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 350,
          mass: 0.5,
        }}
        className="bg-black/40 w-[100%] max-w-[650px] h-[70%] p-6 backdrop-blur-xl
          rounded-3xl rounded-tr-[50px] mb-[0.5em]
          shadow-2xl border border-white/5
          hover:border-white/10 transition-colors
          bg-gradient-to-br from-black/40 to-black/20
          flex flex-col"
        whileHover={{
          scale: 1.005,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.995 }}
      >
        <input
          type="text"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent outline-none text-[18px] font-normal mb-2"
          placeholder="New Task"
        />
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            e.target.style.height = "auto"
            e.target.style.height = Math.min(e.target.scrollHeight, 400) + "px"
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              setNotes(notes + "\n")
            }
          }}
          className="w-full min-h-[150px] max-h-[400px] bg-transparent outline-none text-[16px] font-light pb-[2em] resize-none overflow-y-auto mb-2"
          placeholder="Notes"
        />
        <div className="flex flex-col items-center justify-between md:flex-row w-full mb-2">
          <h2 className="text-[16px] font-semibold pb-1">Estimated time:</h2>
          <div className="flex items-center flex-row md:hidden w-full gap-2">
            {date && (
              <div className="w-full bg-inherit items-center justify-center h-[44px] px-3 flex">
                {date.amount} {date.amount === 1 ? "Hour" : date.type}
              </div>
            )}
            <button
              onClick={() => setShowDatePicker(true)}
              className="w-full min-w-[120px] rounded-md h-[44px] p-2 bg-white/10 hover:bg-white/20 transition-colors"
            >
              Pick time
            </button>
          </div>

          <div className="hidden md:flex items-start gap-3 h-[44px]">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative w-24">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="1"
                  max={estimatedTimeInHours.unit === "Hours" ? 23 : 20}
                  value={estimatedTimeInHours.amount || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value)
                    if (!isNaN(value)) {
                      handlePickerChange({ amount: value })
                    }
                  }}
                  className="w-full bg-neutral-800/50 backdrop-blur-xl rounded-xl h-full px-4 outline-none
                    text-center text-[16px] appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                    hover:bg-neutral-800/70 transition-colors
                    focus:bg-neutral-800/90 focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1"></div>
              </div>
              <div className="relative w-32">
                <select
                  value={estimatedTimeInHours.unit}
                  onChange={(e) =>
                    handlePickerChange({ unit: e.target.value as TimeUnit })
                  }
                  className="w-full appearance-none bg-neutral-800/50 backdrop-blur-xl rounded-xl h-full px-4 pr-10 outline-none
                    text-[16px] cursor-pointer
                    hover:bg-neutral-800/70 transition-colors
                    focus:bg-neutral-800/90 focus:ring-2 focus:ring-blue-500/20"
                >
                  {estimatedTimeOptions.unit.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="relative flex items-center bg-neutral-800 h-[44px] rounded-md px-3 py-2">
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
              className="w-[100%] bg-transparent outline-none text-[14px] pl-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Amount"
            />
          </div>

          <div className="my-auto py-2 w-fit flex flex-col">
            <label className="inline-flex items-center justify-between gap-6 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
                Public task
              </span>
              <input
                type="checkbox"
                defaultChecked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
            </label>
            <label className="pt-2 inline-flex items-center justify-between gap-6 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
                For an opensource project?
              </span>
              <input
                type="checkbox"
                defaultChecked={isOpensource}
                onChange={(e) => setIsOpensourse(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
            </label>

            <label className="pt-2 inline-flex items-center justify-between gap-6 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
                Allow multiple investors (crowdfunding)?
              </span>
              <input
                type="checkbox"
                defaultChecked={isCrowdfunding}
                onChange={(e) => setIsCrowdfunding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
            </label>
            {isCrowdfunding && (
              <span className="text-xs text-gray-800 dark:text-gray-400 w-min min-w-fit select-none">
                In this case TODO Escrow will accumulate funds from different
                investors, coming from both TON blockchain, telegram stars, and
                regular card payments, and then create a contract between the
                platform and the doer
              </span>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="py-1 h-[44px] bg-blue-500 w-[100%] hover:opacity-45 transition-opacity text-white text-sm font-medium rounded-md"
              onClick={async () => {
                await createTask({
                  task: {
                    title: title.trim(),
                    notes: notes,
                    public: false,
                    bountyEstimatedTimeInHours:
                      date.type === "Days" ? date.amount * 24 : date.amount,
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
    </div>
  )
}
