import { createFileRoute } from "@tanstack/react-router"
import { Divide, DollarSign, PlusIcon, SquareIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { modalSpring } from "theme/transitions"
import { AddTodoVariants } from "theme/variants"
import Todo from "~/components/Todo"
import AddTodo from "~/components/AddTodo"

interface TodoItem {
  id: number
  title: string
  bounty: number
}

function RouteComponent() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: "make backend work", bounty: 100 },
    { id: 2, title: "make more todos", bounty: 10 },
  ])
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

  const handleTodoClick = (id: number) => {
    setExpandedTodoId((prevId) => (prevId === id ? null : id))
  }

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="w-full p-4 py-[70px] max-w-[500px] h-full relative min-h-screen">
          <AddTodo setTodos={setTodos} todos={todos} />
          <div className="flex flex-col gap-1">
            {todos.map((todo) => (
              <Todo
                key={todo.id}
                id={todo.id}
                title={todo.title}
                bounty={todo.bounty}
                isExpanded={expandedTodoId === todo.id}
                onClick={() => handleTodoClick(todo.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute("/")({
  component: () => <RouteComponent />,
})
