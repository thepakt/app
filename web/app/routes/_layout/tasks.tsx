import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useTonAddress } from '@tonconnect/ui-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import AddTodoButton from '~/components/AddTodoButton'
import { DatePicker } from '~/components/DatePicker'
import NewTask from '~/components/NewTask'

function RouteComponent() {
  const address = useTonAddress()
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(
    new URLSearchParams(location.search).has('create'),
  )
  const [expandedTodoId, setExpandedTodoId] = useState<number | null>(null)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [date, setDate] = useState<{ amount: number; type: string }>({
    amount: 1,
    type: 'Hours',
  })
  const router = useRouter()
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

  // TODO: store ?create in location.search if isNewTodoOpen
  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   if (isNewTodoOpen) {
  //     searchParams.set('create', 'true'); // Add `create` parameter
  //   } else {
  //     searchParams.delete('create'); // Remove `create` parameter
  //   }
  //   router.commitLocation({
  //     ...router.state.location,
  //     searchStr: searchParams.toString(),
  //     replace: true,
  //   });
  // }, [isNewTodoOpen, location.pathname, router]);

  const { data, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      // const res = await getActiveTasksAndNotifications({
      //   walletAddress: address,
      // })
      // console.log(res)
      // return res
    },
    enabled: !!address,
  })

  return (
    <div className="container pb-[3em] mx-auto px-4 mb-10">
      <h1 className="text-xl font-medium futura text-start pt-[1.2em]">
        Your Active Tasks
      </h1>
      <AnimatePresence>
        {isNewTodoOpen && (
          <NewTask
            onClose={() => setIsNewTodoOpen(false)}
            showDatePicker={isDatePickerOpen}
            date={date}
            setShowDatePicker={setIsDatePickerOpen}
          />
        )}
      </AnimatePresence>
      <div className="w-full flex items-center justify-center overflow-hidden">
        <div className="w-full py-[0.5em] min-w-[300px] max-w-[500px] h-full">
          <DatePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            setDate={setDate}
          />

          <div className="flex flex-col gap-1 mt-2">
            {/* @ts-ignore */}
            {data?.tasks?.map((task) => {
              if (task?.workOnTaskHasStarted) return <></>
              return (
                <>
                  {/* <TaskComponent
                    key={task.id}
                    telegramUsernameOfInvestor={
                      Array.isArray(data?.taskNotifications) &&
                      data.taskNotifications.find(
                        (taskNotification: {
                          task: { id: string }
                          contractAddress: string
                        }) => taskNotification.task.id === task.id,
                      )?.telegramUsernameOfInvestor
                    }
                    showNotification={
                      (data?.taskNotifications?.filter(
                        (notification: { task: { id: string } }) =>
                          notification.task.id === task.id,
                      )?.length ?? 0) > 0
                    }
                    contractOfTask={
                      data?.taskNotifications?.find(
                        (taskNotification: {
                          task: { id: string }
                          contractAddress: string
                        }) => taskNotification.task.id === task.id,
                      )?.contractAddress
                    }
                    task={task}
                    isExpanded={expandedTodoId === task.id}
                    onClick={(id) => {
                      // @ts-ignore
                      setExpandedTodoId((prevId) => (prevId === id ? null : id))
                    }}
                  /> */}
                </>
              )
            })}
            {/* {(!data?.tasks || data.tasks.length === 0) && !isNewTodoOpen && (
              <p className="text-center text-white/30 mt-4">
                You don't have any tasks yet.
                <br />
                <span
                  onClick={() => {
                    if (address && address.length) {
                      setIsNewTodoOpen(true)
                    } else {
                      router.commitLocation({
                        ...router.state.location,
                        href: "/connect?from=/tasks?create",
                      })
                    }
                  }}
                  className="text-white/60 cursor-pointer"
                >
                  Create one
                </span>{" "}
                to get started
              </p>
            )} */}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {!isNewTodoOpen && (
          <div className="fixed bottom-20 left-0 right-2 flex justify-center">
            <AddTodoButton
              isLoggedIn={!!(address && address.length)}
              setIsNewTodoOpen={setIsNewTodoOpen}
              isNewTodoOpen={isNewTodoOpen}
            />
          </div>
        )}
      </AnimatePresence>

      {/* {data?.tasks?.some((task) => task.workOnTaskHasStarted) && (
        <div className="w-full flex flex-col items-start">
          <h1 className="text-md font-semibold pt-[1.2em]">
            Tasks In Progress
          </h1>
          <div className="flex flex-col gap-2 mt-4 items-center w-full max-w-[500px]">
            {data.tasks
              .filter((task) => task.workOnTaskHasStarted)
              .map((task) => (
                <TaskComponentInvested key={task.id} task={task} />
              ))}
          </div>
        </div>
      )} */}
    </div>
  )
}

export const Route = createFileRoute('/_layout/tasks')({
  component: RouteComponent,
})
