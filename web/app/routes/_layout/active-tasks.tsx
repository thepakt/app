import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonAddress } from "@tonconnect/ui-react"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { getActiveTasks } from "~/actions"
import AddTodoButton from "~/components/AddTodoButton"
import Layout from "~/components/Layout"
import NewTodo from "~/components/NewTodo"
import { TaskComponent } from "~/components/TaskComponent"

function TasksComponent() {
  const address = useTonAddress()
  const { data, isLoading, error } = useQuery({
    queryKey: ["/active-tasks"],
    queryFn: async () => {
      const res = await getActiveTasks({ walletAddress: address })
      console.log(res)
      return res
    },
    enabled: !!address,
  })
  if (isLoading) return <div>Loading...</div>
  if (error) {
    return <></>
  }

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
  console.log(data, "data")
  return <></>
  // return (
  //     <div className="w-full flex items-center justify-center">
  //       <div className="w-full p-4 py-[0.5em] min-w-[300px] max-w-[500px] h-full">
  //         <div className="flex flex-col gap-1 mt-16">
  //           <AnimatePresence>
  //             {isNewTodoOpen && (
  //               <NewTodo onClose={() => setIsNewTodoOpen(false)} />
  //             )}
  //           </AnimatePresence>
  //           {data?.tasks?.map((task) => (
  //             <TaskComponent
  //               key={task.id}
  //               task={task}
  //               // @ts-ignore
  //               isExpanded={expandedTodoId === task.id}
  //               onClick={(id) => {
  //                 setExpandedTodoId((prevId) => (prevId === id ? null : id))
  //               }}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //     <div className="absolute bottom-20 left-0 right-2 flex justify-center">
  //       <AddTodoButton
  //         setIsNewTodoOpen={setIsNewTodoOpen}
  //         isNewTodoOpen={isNewTodoOpen}
  //       />
  //     </div>
  // )
}

export const Route = createFileRoute("/_layout/active-tasks")({
  component: TasksComponent,
})
