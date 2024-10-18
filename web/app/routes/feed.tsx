import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { SkeletonFeed } from "~/components/skeletons/SkeletonFeed"

export interface FeedItem {
  id: number
  username: string
  prettyName: string
  description: string
  bounty: number
  subtasks: {
    id: number
    title: string

    bounty: number
  }[]
}
function RouteComponent() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 1,
      username: "@Peter_0555",
      prettyName: "Peter",
      description:
        "Made a Todo app using tanstack and tailwind as the front and Ronin as the back",
      bounty: 200,
      subtasks: [
        {
          id: 1,
          title: "Make the backend work",
          bounty: 100,
        },
        {
          id: 2,
          title: "Add nice UI using tailwind",
          bounty: 100,
        },
      ],
    },
    {
      id: 2,
      username: "@Peter_0555",
      prettyName: "Peter",
      description:
        "Made a Todo app using tanstack and tailwind as the front and Ronin as the back",
      bounty: 200,
      subtasks: [
        {
          id: 1,
          title: "Make the backend work",
          bounty: 100,
        },
        {
          id: 2,
          title: "Add nice UI using tailwind",
          bounty: 100,
        },
      ],
    },
  ])
  return (
    <main className="w-full flex items-center justify-center">
      <section className="w-full p-4 py-[70px] max-w-[500px] h-full relative min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Feed</h1>
          <button className="text-sm font-medium text-primary-500">
            Filter
          </button>
        </div>
        <ul className="flex flex-col gap-4">
          {feedItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col bg-neutral-800 p-4 rounded-lg drop-shadow-md gap-2"
            >
              <article>
                <header className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[42px] w-[42px] h-[42px] bg-neutral-700 rounded-full" />
                    <div className="flex flex-col">
                      <h2 className="text-sm font-bold ">{item.prettyName}</h2>
                      <p className="text-xs text-gray-500">{item.username}</p>
                    </div>
                  </div>
                  <span className="w-fit text-end text-[14px] font-medium bg-neutral-700 px-3 rounded-md p-1">
                    {item.bounty}$
                  </span>
                </header>
                <p className="mt-2 p-2 px-3 text-[14px] max-h-[160px] overflow-auto no-scrollbar bg-neutral-700/60 rounded-lg">
                  {item.description}
                </p>
                <ul className="flex flex-col gap-2 mt-2">
                  {item.subtasks.map((subtask) => (
                    <li
                      key={subtask.id}
                      className="flex items-center gap-3 w-full"
                    >
                      <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                      <p className="text-[14px] flex items-center justify-between p-2 bg-neutral-700/60 rounded-lg w-full">
                        {subtask.title}
                        <span className="text-[12px] text-gray-400 pr-1 font-medium">
                          {subtask.bounty}$
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export const Route = createFileRoute("/feed")({
  component: () => <RouteComponent />,
})
