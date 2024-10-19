import { createFileRoute } from "@tanstack/react-router"
import { ThumbsDownIcon, ThumbsUp, ThumbsUpIcon } from "lucide-react"

import { useState } from "react"
import { UserData } from "~/components/profile/userData"
import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from "react-icons/fa"
import { motion, MotionGlobalConfig, AnimatePresence } from "framer-motion"
import { TodoItem } from "~/components/profile/TodoItem"
import Layout from "~/components/Layout"

function ProfileComponent() {
  return (
    <Layout>
      <main className="w-full flex items-center justify-center">
        <section className="w-full p-4 py-[70px] max-w-[500px] h-full relative min-h-screen">
          <div className="flex justify-between relative">
            <div className="flex  gap-3">
              <div className="w-[100px] h-[100px] bg-neutral-700 rounded-lg"></div>

              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">{UserData.prettyName}</h1>
                <p className="text-sm text-gray-500">{UserData.username}</p>
                <p className="text-sm mt-3 px-3 text-center text-gray-400 bg-neutral-700 p-1 rounded-md">
                  {UserData.tasksCompleted} tasks completed
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-evenly">
              {UserData.socialLinks.twitter && (
                <span className="text-sm hover:scale-[1.05] hover:text-gray-300 transition-all text-gray-500">
                  <FaTwitter />
                </span>
              )}
              {UserData.socialLinks.github && (
                <span className="text-sm hover:scale-[1.05] hover:text-gray-300 transition-all text-gray-500">
                  <FaGithub />
                </span>
              )}
              {UserData.socialLinks.telegram && (
                <span className="text-sm hover:scale-[1.05] hover:text-gray-300 transition-all text-gray-500">
                  <FaTelegram />
                </span>
              )}
            </div>
          </div>
          <ul className="flex flex-col gap-2 mt-4">
            {UserData.todos.map((todo, index) => (
              <TodoItem key={index} todo={todo} />
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  )
}

export const Route = createFileRoute("/profile")({
  component: ProfileComponent,
})
