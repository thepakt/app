import { createFileRoute } from "@tanstack/react-router"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import AddTodoButton from "~/components/AddTodoButton"
import NewTodo from "~/components/NewTodo"
import Todo from "~/components/Todo"
import Layout from "~/components/Layout"

interface TodoItem {
  id: number
  title: string
  bounty: number
  notes?: string
  estimatedTime?: string
  dueDate?: string | null
}

function TasksComponent() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: "make backend work", bounty: 100 },
    { id: 2, title: "make more todos", bounty: 10 },
  ])
  const [expandedTodoId, setExpandedTodoId] = useState<number | null>(null)
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false)

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

  const handleTodoClick = (id: number) => {
    setExpandedTodoId((prevId) => (prevId === id ? null : id))
  }

  return (
    <Layout>
      <div className="w-full flex items-center justify-center">
        <div className="w-full p-4 py-[0.5em] min-w-[300px] max-w-[500px] h-full">
          <div className="flex flex-col gap-1 mt-16">
            <AnimatePresence>
              {isNewTodoOpen && (
                <NewTodo
                  setTodos={setTodos}
                  onClose={() => setIsNewTodoOpen(false)}
                />
              )}
            </AnimatePresence>
            {todos.map((todo) => (
              <Todo
                key={todo.id}
                id={todo.id}
                title={todo.title}
                notes={todo.notes ?? ""}
                estimatedTime={todo.estimatedTime ?? ""}
                bounty={todo.bounty}
                dueDate={todo.dueDate ? new Date(todo.dueDate) : undefined}
                isExpanded={expandedTodoId === todo.id}
                onClick={() => handleTodoClick(todo.id)}
                onUpdate={(id, updates) => {
                  setTodos(
                    todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                  )
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 left-0 right-2 flex justify-center">
        <AddTodoButton
          setTodos={setTodos}
          todos={todos}
          setIsNewTodoOpen={setIsNewTodoOpen}
          isNewTodoOpen={isNewTodoOpen}
        />
      </div>
    </Layout>
  )
}

export const Route = createFileRoute("/active-tasks")({
  component: TasksComponent,
})
