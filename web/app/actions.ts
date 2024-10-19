import { createServerFn } from "@tanstack/start"
import { create, get } from "ronin"

export const createUser = createServerFn(
  "POST",
  async (data: { walletAddress: string }) => {
    const userExists = await get.user.with({
      walletAddress: data.walletAddress,
    })
    if (userExists) return userExists
    const newUser = await create.user.with({
      walletAddress: data.walletAddress,
    })
    return newUser
  },
)

export const createTask = createServerFn(
  "POST",
  async (data: {
    task: {
      title: string
      notes: string
      public: boolean
      bountyEstimatedTimeInHours: number
      bountyPriceInUsdt: number
    }
    userWalletAddress: string
    subtasks: string[]
  }) => {
    const user = await get.user.with({
      walletAddress: data.userWalletAddress,
    })
    if (!user) throw new Error("User not found")
    const task = await create.task.with({
      ...data.task,
      public: true,
      creator: user.id,
    })
    if (!task) return
    data.subtasks.forEach(async (subtask, index) => {
      await create.subtask.with({
        title: subtask,
        orderNumber: index,
        parentTask: task.id,
      })
    })
    return task
  },
)

export const getActiveTasks = createServerFn(
  "POST",
  async (data: { walletAddress: string }) => {
    const user = await get.user.with({
      walletAddress: data.walletAddress,
    })
    if (!user) throw new Error("User not found")
    const tasks = await get.tasks.with({
      creator: user,
    })
    return tasks
  },
)

export const getActiveTasksAndNotifications = createServerFn(
  "POST",
  async (data: { walletAddress: string }) => {
    const user = await get.user.with({
      walletAddress: data.walletAddress,
    })
    if (!user) throw new Error("User not found")
    const tasks = await get.tasks.with({
      creator: user,
    })
    // const taskNotifications = await get.acceptTaskNotifications.with({
    //   reciever: user.id,
    // })
    const taskNotifications = await get.acceptTaskNotifications()
    return {
      tasks,
      taskNotifications,
    }
  },
)

export const getTaskWithItsCreator = createServerFn(
  "POST",
  async (data: { taskId: string }) => {
    const task = await get.task.with({
      id: data.taskId,
    })
    if (!task) throw new Error("Task not found")
    const user = await get.user.with({
      id: task.creator,
    })
    return {
      task: {
        ...task,
      },
      creator: user,
    }
  },
)

export const getModerator = createServerFn("POST", async (data: {}) => {
  const moderator = await get.user.with({
    // TODO: for now hard coding olya's wallet address
    walletAddress: "UQBKIwvbUPZ5fTCUFvCiD9bUSIljJ3cafNaxQ46YPapJcAaq",
  })
  return moderator
})

export const getPublicTasks = createServerFn("POST", async (data: {}) => {
  const tasks = await get.tasks()
  return tasks
})

export const createAcceptTaskNotification = createServerFn(
  "POST",
  async (data: {
    taskId: string
    contractAddress: string
    recieverWalletAddress: string
  }) => {
    const reciever = await get.user.with({
      walletAddress: data.recieverWalletAddress,
    })
    if (!reciever) throw new Error("Reciever not found")
    const task = await get.task.with({
      id: data.taskId,
    })
    if (!task) throw new Error("Task not found")
    const acceptTaskNotification = await create.acceptTaskNotification.with({
      task: task.id,
      contractAddress: data.contractAddress,
      reciever: reciever.id,
    })
    return acceptTaskNotification
  },
)
