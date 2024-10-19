import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Address } from "@ton/core"
import { useTonAddress } from "@tonconnect/ui-react"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { getActiveTasksAndNotifications } from "~/actions"
import AddTodoButton from "~/components/AddTodoButton"
import { DatePicker } from "~/components/DatePicker"
import NewTask from "~/components/NewTask"
import { TaskComponent } from "~/components/TaskComponent"
import useActions from "~/lib/investor/useActions"

function RouteComponent() {
  const address = useTonAddress()
  const { startContract } = useActions()
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false)
  const [expandedTodoId, setExpandedTodoId] = useState<number | null>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".todo-item")) {
        setExpandedTodoId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const { data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await getActiveTasksAndNotifications({
        walletAddress: address,
      })
      console.log(res)
      return res
    },
    enabled: !!address,
  })
  if (error) {
    return <></>
  }
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [date, setDate] = useState<{ amount: number; type: string }>({
    amount: 1,
    type: "Hours",
  })

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div>
          {/* @ts-ignore */}
          {data?.taskNotifications?.map((taskNotification) => {
            return (
              <div
                key={taskNotification.id}
                onClick={async () => {
                  const contractStarted = await startContract(
                    Address.parse(taskNotification.contractAddress),
                  )
                  console.log(contractStarted, "contractStarted")
                }}
              >
                Can you do this? {taskNotification.contractAddress}
              </div>
            )
          })}
        </div>
        <div className="w-full p-4 py-[0.5em] min-w-[300px] max-w-[500px] h-full">
          <DatePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            setDate={setDate}
          />

          <button
            onClick={() => setIsDatePickerOpen(true)}
            className="absolute bottom-[200px] bg-red-500 right-0"
          >
            show picker
          </button>
          <div className="flex flex-col gap-1 mt-16">
            <AnimatePresence>
              {isNewTodoOpen && (
                <NewTask onClose={() => setIsNewTodoOpen(false)} />
              )}
            </AnimatePresence>
            {/* @ts-ignore */}
            {data?.tasks?.map((task) => (
              <TaskComponent
                key={task.id}
                task={task}
                // @ts-ignore
                isExpanded={expandedTodoId === task.id}
                onClick={(id) => {
                  // @ts-ignore
                  setExpandedTodoId((prevId) => (prevId === id ? null : id))
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {address && (
        <div className="absolute bottom-20 left-0 right-2 flex justify-center">
          <AddTodoButton
            setIsNewTodoOpen={setIsNewTodoOpen}
            isNewTodoOpen={isNewTodoOpen}
          />
        </div>
      )}
    </>
  )
}

export const Route = createFileRoute("/_layout/tasks")({
  component: RouteComponent,
})
