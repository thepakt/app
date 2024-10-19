import { createFileRoute } from "@tanstack/react-router"
import { useTonWallet } from "@tonconnect/ui-react"
import { AnimatePresence } from "framer-motion"
import { ID } from "jazz-tools"
import { useEffect, useState } from "react"
import AddTodoButton from "~/components/AddTodoButton"
import Layout from "~/components/Layout"
import NewTodo from "~/components/NewTodo"
import { TaskComponent } from "~/components/TaskComponent"
import { useAccount } from "~/lib/providers/jazz-provider"
import { Task } from "~/lib/schema/task"

function TasksComponent() {
  const wallet = useTonWallet()
  useEffect(() => {}, [wallet])
  const { me } = useAccount({ root: { tasks: [{}], walletAddress: "" } })

  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false)
  const [expandedTodoId, setExpandedTodoId] = useState<ID<Task> | null>(null)

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

  return (
    <Layout>
      <div className="w-full flex items-center justify-center">
        <div className="w-full p-4 py-[0.5em] min-w-[300px] max-w-[500px] h-full">
          <div className="flex flex-col gap-1 mt-16">
            <AnimatePresence>
              {isNewTodoOpen && (
                <NewTodo onClose={() => setIsNewTodoOpen(false)} />
              )}
            </AnimatePresence>
            {me?.root?.tasks.map((task) => (
              <TaskComponent
                key={task.id}
                task={task}
                isExpanded={expandedTodoId === task.id}
                onClick={(id) => {
                  setExpandedTodoId((prevId) => (prevId === id ? null : id))
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 left-0 right-2 flex justify-center">
        <AddTodoButton
          setIsNewTodoOpen={setIsNewTodoOpen}
          isNewTodoOpen={isNewTodoOpen}
        />
      </div>
    </Layout>
  )
}

export const Route = createFileRoute("/_layout/active-tasks")({
  component: TasksComponent,
})
