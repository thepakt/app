import { createJazzReactApp } from 'jazz-react'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Todo from '~/components/Todo'
import AddTodoButton from '~/components/AddTodoButton'
import NewTodo from '~/components/NewTodo'
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'
import { useAccountOrGuest } from '~/lib/providers/jazz-provider'

interface TodoItem {
  id: number
  title: string
  bounty: number
  notes?: string
  estimatedTime?: string
  dueDate?: string | null
}

function RouteComponent() {
  const { me } = useAccountOrGuest()

  const address = useTonAddress()

  useEffect(() => {
    if (address) {
      console.log(address, 'address')
    }
  }, [address])

  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, title: 'make backend work', bounty: 100 },
    { id: 2, title: 'make more todos', bounty: 10 },
  ])
  const [expandedTodoId, setExpandedTodoId] = useState<number | null>(null)
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.todo-item')) {
        setExpandedTodoId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleTodoClick = (id: number) => {
    setExpandedTodoId((prevId) => (prevId === id ? null : id))
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4">
        <TonConnectButton />
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="w-full p-4 py-[0.5em] min-w-[300px] max-w-[500px] h-full">
          <AddTodoButton
            setTodos={setTodos}
            todos={todos}
            setIsNewTodoOpen={setIsNewTodoOpen}
          />
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
                notes={todo.notes ?? ''}
                estimatedTime={todo.estimatedTime ?? ''}
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
    </div>
  )
}

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
})