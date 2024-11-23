import { useQueryClient } from "@tanstack/react-query"
import { useTonAddress } from "@tonconnect/ui-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { createTask } from "~/actions"
import { ChevronDown } from "lucide-react"
import { GridListSubtasks } from "./ui/grid-list-subtasks"

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
  const [results, setResults] = useState("")
  const [bounty, setBounty] = useState("")
  const [subtasks, setSubtasks] = useState<
    Array<{ id: number; subtask: string }>
  >([
    { id: 1, subtask: "" },
    { id: 2, subtask: "" },
  ])
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
        className="bg-secondary w-[100%] max-w-[650px] h-[70%] p-4 backdrop-blur-xl
          rounded-3xl mb-[0.5em]
          shadow-2xl border border-white/5
          hover:border-white/10 transition-colors
          bg-gradient-to-br from-muted/80 to-muted/60
          flex flex-col"
        // TBH this scale blurs the block a bit, and the text is harder to read
        // we can use this effect on buttons, but not the whole block
        // whileHover={{
        //   scale: 1.005,
        //   transition: { duration: 0.2 },
        // }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="mb-6">
          {/* Project Name Section */}
          <label
            htmlFor="projectName"
            className="block text-gray-200 text-lg font-serif mb-2"
          >
            Name of your project
          </label>
          <p className="text-gray-400 text-xs font-serif italic mb-2">
            How would you like the internet to see it?
          </p>
          <input
            type="text"
            id="projectName"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Soup'em All VR: Art Revolution Simulator"
            className="w-full bg-neutral-800 rounded-lg p-2 text-white font-serif text-sm outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-6">
          {/* Description Section */}
          <label
            htmlFor="projectDescription"
            className="block text-gray-200 text-lg font-serif mb-2"
          >
            Description
          </label>
          <p className="text-gray-400 text-xs font-serif italic mb-2">
            Explain, in detail:
            <ul className="list-disc list-inside mt-1">
              <li>What is it about?</li>
              <li>Why would you like to make it?</li>
              <li>Who might need this project?</li>
            </ul>
          </p>
          <textarea
            id="projectDescription"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height =
                Math.min(e.target.scrollHeight, 300) + "px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                setNotes(notes + "\n")
              }
            }}
            placeholder="I'm tired of activists getting arrested for supporting our cause! 
We need a safe space to practice our art of protest. 
            
That's why I'm making a VR app where ANYONE can throw soup at famous paintings! 
Want to splash the Mona Lisa? Click. Starry Night needs some tomato stars? Double click. 
🎨 + 🥫 = 💚"
            className="w-full bg-neutral-800 rounded-lg p-2 text-white text-sm font-serif outline-none min-h-[140px] max-h-[300px] resize-y focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mb-6">
          {/* Results Section */}
          <label
            htmlFor="projectResults"
            className="block text-gray-200 text-lg font-serif mb-2"
          >
            Result
          </label>
          <p className="text-gray-400 text-xs font-serif italic mb-2">
            What will be the final product? What features will it have?
          </p>
          <textarea
            id="projectResults"
            value={results}
            onChange={(e) => {
              setResults(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height =
                Math.min(e.target.scrollHeight, 300) + "px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                setResults(results + "\n")
              }
            }}
            placeholder="I'll create the most realistic soup-throwing simulator ever:
 • Perfect soup physics
 • 100+ famous paintings to 'improve'
 • Realistic museum guard AI
 • Global leaderboard of eco-warriors"
            className="w-full bg-neutral-800 rounded-lg p-2 text-white text-sm font-serif outline-none min-h-[120px] max-h-[300px] resize-y focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mb-6 flex flex-col">
          {/* Results Project Stages */}
          <label
            htmlFor="projectStages"
            className="block text-gray-200 text-lg font-serif mb-2"
          >
            Project Stages
          </label>
          <p className="text-gray-400 text-xs font-serif italic mb-2">
            List the main steps to complete project. What needs to be done?
          </p>
          <GridListSubtasks
            aria-label="Milestones"
            items={subtasks}
            id="projectStages"
          >
            {(item) => (
              <GridListSubtasks.Item>
                <input
                  value={item.subtask}
                  onChange={(e) => {
                    const updatedSubtasks = [...subtasks]
                    const index = subtasks.findIndex((el) => el.id == item.id)
                    updatedSubtasks[index] = {
                      ...updatedSubtasks[index],
                      subtask: e.target.value,
                    }
                    setSubtasks(updatedSubtasks)
                  }}
                  className="w-full bg-neutral-800 rounded-md p-2 text-white font-serif text-sm outline-none focus:ring-2 focus:ring-accent"
                  placeholder={
                    item.id == 1
                      ? "Build soup physics engine (I know a guy)"
                      : item.id == 2
                        ? "Get 3D models of paintings (legally, this time)"
                        : ""
                  }
                />
                <button
                  disabled={subtasks.findIndex((el) => el.id == item.id) == 0}
                  onClick={() => {
                    const updatedSubtasks = subtasks.filter(
                      (el) => el.id !== item.id,
                    )
                    setSubtasks(updatedSubtasks)
                  }}
                  className="absolute right-0 z-50 p-2 text-white hover:text-accent rounded-md transition-colors"
                >
                  ✕
                </button>
              </GridListSubtasks.Item>
            )}
          </GridListSubtasks>
          <button
            onClick={() => {
              const newSubtask = {
                id:
                  subtasks.length > 0
                    ? subtasks[subtasks.length - 1].id + 1
                    : 1,
                subtask: "",
              }
              setSubtasks([...subtasks, newSubtask])
            }}
            className="mt-2 w-[90%] h-[24px] self-center text-center text-neutral-200 text-xs bg-neutral-600 rounded-md hover:bg-muted transition-colors"
          >
            + add new stage
          </button>
        </div>
        <div className="mb-6">
          {/* Funding Section */}
          <label
            htmlFor="projectFunding"
            className="block text-gray-200 text-lg font-serif mb-2"
          >
            Funding Goal
          </label>
          <p className="text-gray-400 text-xs font-serif italic mb-2 p-2 border-dashed border-muted rounded-md border-2 w-96">
            Once you reach your goal, a smart contract will be created to manage
            the funds. Backers' investments will be secured — if you don't
            deliver, funds will be automatically returned and your reputation
            score may decrease
          </p>
          <div className="relative flex items-center bg-neutral-800 h-[44px] rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
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
        </div>
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
                    focus:bg-neutral-800/90 focus:ring-2 focus:ring-accent"
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
                    focus:bg-neutral-800/90 focus:ring-2 focus:ring-accent"
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
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>
            <label className="pt-2 inline-flex items-center justify-between gap-6 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
                For an opensource project
              </span>
              <input
                type="checkbox"
                defaultChecked={isOpensource}
                onChange={(e) => setIsOpensourse(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
            </label>

            <label className="pt-2 inline-flex items-center justify-between gap-6 cursor-pointer">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
                Allow multiple investors (crowdfunding)
              </span>
              <input
                type="checkbox"
                defaultChecked={isCrowdfunding}
                onChange={(e) => setIsCrowdfunding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent"></div>
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
              className="py-1 h-[44px] bg-accent w-[100%] hover:opacity-45 transition-opacity text-white text-sm font-medium rounded-md"
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
