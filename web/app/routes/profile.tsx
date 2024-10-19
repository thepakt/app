import { createFileRoute } from "@tanstack/react-router"
import { ThumbsDownIcon, ThumbsUp, ThumbsUpIcon } from "lucide-react"

import { useState } from "react"
import { UserData } from "~/components/profile/userData"
import { FaDiscord, FaGithub, FaTelegram, FaTwitter } from "react-icons/fa"
import { motion, MotionGlobalConfig, AnimatePresence } from "framer-motion"
import { TodoItem } from "~/components/profile/TodoItem"
import Layout from "~/components/Layout"

export default function ProfileComponent() {
  return (
    <Layout>
      <main className="w-full flex items-center justify-center">
        <section className="w-full p-[1em] py-[4em] min-h-screen">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-white">
                    {UserData.prettyName}
                  </h1>
                  <p className="text-sm text-gray-300">@{UserData.username}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm px-4 py-2 text-white bg-gray-800 rounded-full inline-block">
                {UserData.tasksCompleted} tasks completed
              </p>
              <div className="flex gap-3">
                {UserData.socialLinks.twitter && (
                  <a
                    href={UserData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <FaTwitter className="text-xl text-gray-300 hover:text-blue-400 transition-all" />
                  </a>
                )}
                {UserData.socialLinks.github && (
                  <a
                    href={UserData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <FaGithub className="text-xl text-gray-300 hover:text-white transition-all" />
                  </a>
                )}
                {UserData.socialLinks.telegram && (
                  <a
                    href={UserData.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                  >
                    <FaTelegram className="text-xl text-gray-300 hover:text-blue-300 transition-all" />
                  </a>
                )}
              </div>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg mb-6 hover:bg-blue-600 transition-all">
              Send message
            </button>
            <ul className="flex flex-col gap-3">
              {UserData.todos.map((todo, index) => (
                <TodoItem key={index} todo={todo} />
              ))}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export const Route = createFileRoute("/profile")({
  component: ProfileComponent,
})
