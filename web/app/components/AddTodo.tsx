// import { AnimatePresence, motion } from "framer-motion"
// import { PlusIcon, XIcon } from "lucide-react"
// import { useEffect, useRef, useState } from "react"
// import { modalSpring } from "theme/transitions"
// import { AddTodoVariants } from "theme/variants"

// interface Todo {
//   title: string
//   bounty: number
//   id: number
// }

// interface AddTodoProps {
//   setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
//   todos: Todo[]
// }

// export default function AddTodo({ setTodos, todos }: AddTodoProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [inputValue, setInputValue] = useState("")
//   const modalRef = useRef<HTMLDivElement>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false)
//         setInputValue("")
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen])

//   const handleAddTodo = () => {
//     if (inputValue.trim()) {
//       setTodos((prevTodos) => [
//         {
//           id: Date.now(),
//           title: inputValue.trim(),
//           bounty: 100,
//         },
//         ...prevTodos,
//       ])
//       setInputValue("")
//       setIsOpen(false)
//     }
//   }

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       handleAddTodo()
//     }
//   }

//   return (
//     <AnimatePresence>
//       <motion.div
//         ref={modalRef}
//         className={`absolute flex items-center drop-shadow-lg justify-center text-white overflow-hidden rounded-[30px] ${
//           isOpen ? "bg-primary-600" : "bg-primary-600"
//         }`}
//         variants={AddTodoVariants}
//         initial="closed"
//         animate={isOpen ? "open" : "closed"}
//         transition={modalSpring}
//         onClick={() => !isOpen && setIsOpen(true)}
//       >
//         <motion.div
//           className="relative z-10 w-full h-full flex items-center justify-center"
//           initial={{ opacity: 1 }}
//           animate={{ opacity: isOpen ? 0 : 1 }}
//           transition={{ duration: 0.2 }}
//         >
//           {isOpen ? <XIcon size={28} /> : <PlusIcon size={28} />}
//         </motion.div>
//         {isOpen && (
//           <motion.div
//             className="absolute inset-0 z-20 px-4 flex items-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.1 }}
//           >
//             <input
//               ref={inputRef}
//               type="text"
//               autoFocus
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//               className="w-full placeholder-white outline-none bg-transparent text-[18px] font-medium p-2"
//               placeholder="Add a new todo..."
//             />
//           </motion.div>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   )
// }

import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { modalSpring } from "theme/transitions"
import { AddTodoVariants } from "theme/variants"

interface Todo {
  title: string
  bounty: number
  id: number
}

interface AddTodoProps {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  todos: Todo[]
  setIsNewTodoOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddTodo({
  setTodos,
  todos,
  setIsNewTodoOpen,
}: AddTodoProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute flex items-center drop-shadow-lg justify-center text-white overflow-hidden rounded-[30px] bg-primary-600"
        variants={AddTodoVariants}
        initial="closed"
        animate="closed"
        transition={modalSpring}
        onClick={() => setIsNewTodoOpen(true)}
      >
        <motion.div
          className="relative z-10 w-full h-full flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon size={28} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
