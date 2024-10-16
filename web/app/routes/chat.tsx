import { createFileRoute } from "@tanstack/react-router"
import { useState, KeyboardEvent, useEffect, useRef } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

interface Message {
  id: number
  message: string
  sender: boolean
  time: Date
}

function RouteComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: "yo whatsup",
      sender: false,
      time: new Date(),
    },
    {
      id: 2,
      message:
        "nothing much wbu ttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
      sender: true,
      time: new Date(),
    },
    {
      id: 3,
      message: "doing homework rn",
      sender: false,
      time: new Date(),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newMessage: Message = {
        id: Date.now(),
        message: inputValue.trim(),
        sender: true,
        time: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  const messageVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  }

  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 0.5,
  }

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="w-full relative max-w-[600px] p-2 h-screen">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-grow overflow-y-auto no-scrollbar">
              <div className="flex flex-col justify-end min-h-full pb-[60px] gap-3">
                <AnimatePresence initial={true}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={springTransition}
                      className={`${
                        message.sender
                          ? "self-end bg-white"
                          : "self-start bg-primary-300"
                      } flex flex-col relative z-10 max-w-[50%] break-words drop-shadow-lg p-4 px-6 rounded-[28px]`}
                    >
                      <div className="relative z-10">{message.message}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="h-[60px] mb-4 flex items-center justify-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full p-3 px-5 rounded-full bg-white border border-slate-400/20 outline-none drop-shadow-md"
                placeholder="Type a message..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute("/chat")({
  component: () => <RouteComponent />,
})
