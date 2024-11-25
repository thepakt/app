import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTonAddress } from "@tonconnect/ui-react"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { $getActiveTasksAndNotifications } from "~/actions/actions"
import AddTodoButton from "~/components/AddTodoButton"
import { DatePicker } from "~/components/DatePicker"
import NewTask from "~/components/NewTask"

function RouteComponent() {
  const address = useTonAddress()
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(
    new URLSearchParams(location.search).has("create"),
  )
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [date, setDate] = useState<{ amount: number; type: string }>({
    amount: 1,
    type: "Hours",
  })
  const { data, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await $getActiveTasksAndNotifications({
        // @ts-ignore
        walletAddress: address,
      })
      console.log(res)
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
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
