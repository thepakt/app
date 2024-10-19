import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { getPublicTasks } from "~/actions"
import { feedItems } from "~/components/feed/feedItems"
import { Filter } from "~/components/feed/Filter"

function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["explore"],
    queryFn: async () => {
      const res = await getPublicTasks({})
      console.log(res)
      return res
    },
  })
  if (error) return <></>
  if (isLoading) return <></>

  return (
    <main className="w-full flex items-center justify-center">
      <section className="w-full p-4 py-[70px] max-w-[500px] h-full relative min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Feed</h1>
          <Filter />
        </div>
        <ul className="flex flex-col gap-4">
          {/* @ts-ignore */}
          {data.map((task) => {
            return (
              <li
                key={task.id}
                className="flex flex-col bg-neutral-800 p-4 rounded-lg drop-shadow-md gap-2"
              >
                <article>
                  <header className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center cursor-pointer gap-2"
                      onClick={() => {}}
                    >
                      <div className="min-w-[42px] w-[42px] hover:bg-neutral-600 transition-all h-[42px] bg-neutral-700 rounded-full" />
                      <div className="flex flex-col">
                        <h2 className="text-sm font-bold hover:text-primary-400 transition-all">
                          {task.title}
                        </h2>
                        <p className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-all">
                          {task.username}
                        </p>
                      </div>
                    </div>
                    <span className="w-fit text-end text-[14px] font-medium bg-neutral-700 px-3 rounded-md p-1">
                      {task.bounty}$
                    </span>
                  </header>
                  <p className="mt-2 p-2 px-3 text-[14px] max-h-[160px] overflow-auto no-scrollbar bg-neutral-700/60 rounded-lg">
                    {task.description}
                  </p>
                  <ul className="flex flex-col gap-2 mt-2">
                    {/* {item.subtasks.map((subtask) => (
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
                    ))} */}
                  </ul>
                  <button className="w-full bg-blue-600 p-2 font-semibold rounded-md mt-2">
                    Invest
                  </button>
                </article>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}

export const Route = createFileRoute("/_layout/explore")({
  component: () => <RouteComponent />,
})
