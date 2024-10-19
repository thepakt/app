import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton } from "@tonconnect/ui-react"
import { ChevronRight, StarIcon } from "lucide-react"
import { useState } from "react"
import { FaGithub, FaTelegram, FaTwitter } from "react-icons/fa"
import { DatePicker } from "~/components/DatePicker"
import Layout from "~/components/Layout"
import { TodoItem } from "~/components/profile/TodoItem"
import { UserData } from "~/components/profile/userData"

export default function ProfileComponent() {
  return (
    <main className="w-full flex items-center justify-center">
      <section className="w-full p-[1em] pt-[2em] min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 justify-between w-full items-center">
              <div className="w-[50px] h-[50px] bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
              <TonConnectButton />
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-2">
              <p className="flex items-center text-[20px] gap-1">
                <StarIcon />
                4.9
              </p>
              <p className="text-[12px] text-gray-400 rounded-full inline-block">
                {UserData.tasksCompleted} tasks completed
              </p>
            </div>
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
          <button className=" hover:bg-neutral-700 w-full text-center bg-neutral-700/40 text-white py-3 rounded-full mb-6 flex items-center justify-center gap-2 transition-all">
            Invested Into 7 projects <ChevronRight className="" />
          </button>
          <ul className="flex flex-col gap-3">
            <div className="text-[20px] font-semibold">Ready to-do:</div>
            {UserData.todos.map((todo, index) => (
              <TodoItem key={index} todo={todo} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export const Route = createFileRoute("/_layout/profile")({
  component: ProfileComponent,
})
