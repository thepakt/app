import { create, get } from "ronin"

async function main() {
  const walletAddress = "0QCWmH6cEB1YgCSeMFZCBKEitaUWr3wwZt9OBLuGup0s8GnX"
  const reciever = await get.user.with({
    walletAddress,
  })
  if (!reciever) throw new Error("Reciever not found")
  const task = await get.task.with({
    id: "rec_vlfzjz9y5tfj1qo5",
  })
  if (!task) throw new Error("Task not found")
  const acceptTaskNotification = await create.acceptTaskNotification.with({
    task: task.id,
    contractAddress: "0QCWmH6cEB1YgCSeMFZCBKEitaUWr3wwZt9OBLuGup0s8GnX",
    reciever: reciever.id,
  })
  console.log(acceptTaskNotification, "test")
}

// @ts-ignore
await main()
