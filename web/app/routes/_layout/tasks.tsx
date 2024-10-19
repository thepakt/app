import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonAddress } from "@tonconnect/ui-react"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { getActiveTasks } from "~/actions"
import AddTodoButton from "~/components/AddTodoButton"
import NewTask from "~/components/NewTask"
import { TaskComponent } from "~/components/TaskComponent"

function RouteComponent() {
  const address = useTonAddress()
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

  // TODO: avoid using refetch, seems super bad
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await getActiveTasks({ walletAddress: address })
      console.log(res)
      return res
    },
    enabled: !!address,
  })
  if (error) {
    return <></>
  }

  console.log(data, "data")

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="w-full p-4 py-[0.5em] min-w-[300px] max-w-[500px] h-full">
          <div className="flex flex-col gap-1 mt-16">
            <AnimatePresence>
              {isNewTodoOpen && (
                <NewTask onClose={() => setIsNewTodoOpen(false)} />
              )}
            </AnimatePresence>
            {/* @ts-ignore */}
            {data?.map((task) => (
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
