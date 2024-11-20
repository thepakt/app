import { createFileRoute } from "@tanstack/react-router"
import { useState, KeyboardEvent, useEffect, useRef, DragEvent } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import "../styles/chat.css"
import { IconSend, IconSend2, IconSend2Fill } from "justd-icons"
import { Button } from "~/components/ui"

interface Message {
  id: number
  user: string
  message: string
  own: boolean
  time: Date
  reactions?: { emoji: string; users: string[] }[]
  replyTo?: number
  edited?: boolean
  hasReply?: boolean
  firstInGroup?: boolean
  lastInGroup?: boolean
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Eugène Kniazev",
      message:
        "Btw let's schedule a call? Like for 20-30 minutes to sync again after some work is done.",
      time: new Date(),
      reactions: [{ emoji: "❤️", users: ["John Doe"] }],
      own: true,
      edited: false,
      hasReply: false,
      firstInGroup: true,
      lastInGroup: true,
    },
    {
      id: 2,
      user: "Иван Мартемьянов",
      message: "I'm free after around 17:00",
      time: new Date(),
      replyTo: 1,
      own: false,
      edited: false,
      hasReply: true,
      firstInGroup: true,
      lastInGroup: true,
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
        user: "Lorem Ipsum",
        message: inputValue.trim(),
        own: true,
        time: new Date(),
      }
      setMessages([...messages, newMessage])
      setInputValue("")
    }
  }

  const handleSendClick = () => {
    const newMessage: Message = {
      id: Date.now(),
      user: "Lorem Ipsum",
      message: inputValue.trim(),
      own: true,
      time: new Date(),
    }
    setMessages([...messages, newMessage])
    setInputValue("")
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

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    message: Message
  } | null>(null)
  const contextMenuRef = useRef()

  const handleRightClick = (e: MouseEvent, message: Message) => {
    e.preventDefault()
    setContextMenu({
      x: Math.min(e.pageX, window.innerWidth - 500),
      y: e.pageY,
      message,
    })
  }

  const handleMenuAction = (action: string) => {
    const { message } = contextMenu
    if (action === "reply") {
      console.log("Reply to:", message.content)
    } else if (action === "copy") {
      navigator.clipboard.writeText(message.content)
      console.log("Copied:", message.content)
    } else if (action === "delete") {
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id))
    } else if (action === "edit") {
      console.log("Editing message:", message.content)
    }
    setContextMenu(null) // Close the menu
  }

  const closeContextMenu = () => setContextMenu(null)

  const getMessageClasses = (message: Message) => {
    let classes = [
      "Message",
      "message-list-item",
      "allow-selection",
      "shown",
      "open",
    ]

    if (message.firstInGroup) classes.push("first-in-group")
    if (message.lastInGroup) classes.push("last-in-group")
    if (message.own) classes.push("own")
    if (message.edited) classes.push("was-edited")
    if (message.hasReply) classes.push("has-reply")

    return classes.join(" ")
  }

  return (
    <>
      <div className="MessageContainer pb-2">
        <div
          className="MessageList"
          onClick={closeContextMenu} // Close menu on click outside
        >
          <div className="messages-container">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={springTransition}
                  className={getMessageClasses(message)}
                  onContextMenu={(e) =>
                    handleRightClick(e.nativeEvent, message)
                  }
                >
                  <div className="message-select-control"></div>
                  <div className="message-content-wrapper">
                    <div
                      className={`message-content ${
                        message.own
                          ? "has-solid-background"
                          : "peer-color-3 has-solid-background"
                      }`}
                    >
                      <div className="content-inner">
                        {/* Username */}
                        {message.user &&
                          !message.own &&
                          message.firstInGroup && (
                            <div className="message-title" dir="ltr">
                              <span
                                className="message-title-name-container interactive"
                                dir="ltr"
                              >
                                <span className="forward-title-container"></span>
                                <span className="message-title-name">
                                  <span className="sender-title">
                                    {message.user}
                                  </span>
                                </span>
                              </span>
                              <div className="title-spacer"></div>
                            </div>
                          )}
                        {message.replyTo && (
                          <div className="message-reply">
                            <span>Replying to:</span>
                            <p>
                              {
                                messages.find(
                                  (msg) => msg.id === message.replyTo,
                                )?.message
                              }
                            </p>
                          </div>
                        )}
                        <div className="text-content">
                          {message.message}
                          <span className="MessageMeta">
                            <span className="message-time">
                              {message.time.getHours() +
                                ":" +
                                (message.time.getMinutes().toString().length ==
                                2
                                  ? message.time.getMinutes()
                                  : "0" + message.time.getMinutes())}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="middle-column-footer">
          <div className="composer-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="w-full my-1 p-2 px-5 rounded-md bg-transparent outline-none drop-shadow-md"
              placeholder="Type a message..."
            />
          </div>
          <div className="ml-2 self-center">
            <Button
              appearance="solid"
              intent="secondary"
              size="large"
              shape="square"
              isDisabled={inputValue.length < 1}
              onPress={handleSendClick}
            >
              <IconSend2Fill className="text-primary" />
            </Button>
          </div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <div onClick={() => handleMenuAction("reply")}>Reply</div>
            <div onClick={() => handleMenuAction("copy")}>Copy</div>
            {contextMenu.message.own && (
              <div onClick={() => handleMenuAction("edit")}>Edit</div>
            )}
            <div onClick={() => handleMenuAction("delete")}>Delete</div>
          </div>
        )}
      </div>
    </>
  )
}
