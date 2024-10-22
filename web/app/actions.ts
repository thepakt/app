import { createServerFn } from "@tanstack/start"
import { create, drop, get, set } from "ronin"

export const createUser = createServerFn(
  "POST",
  async (data: { walletAddress: string }) => {
    const userExists = await get.user.with({
      walletAddress: data.walletAddress,
    })
    console.log(userExists, "user exists")
    if (userExists) return userExists
    const newUser = await create.user.with({
      walletAddress: data.walletAddress,
    })
    return newUser
  },
)

export const updateTgUsername = createServerFn(
  "POST",
  async (data: { tgUsername: string; walletAddress: string }) => {
    await set.user({
      with: {
        walletAddress: data.walletAddress,
      },
      to: {
        username: data.tgUsername,
      },
    })
  },
)

export const updateTgPhoto = createServerFn(
  "POST",
  async (data: { tgPhotoUrl: string; walletAddress: string }) => {
    await set.user({
      with: {
        walletAddress: data.walletAddress,
      },
      to: {
        // @ts-ignore
        photoUrl: data.tgPhotoUrl,
      },
    })
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

export const getProfile = createServerFn(
  "POST",
  async (data: { walletAddress: string }) => {
    const user = await get.user.with({
      walletAddress: data.walletAddress,
    })
    if (!user) throw new Error("User not found")
    return user
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
    const taskNotifications = await get.acceptTaskNotifications({
      including: ["task", "reciever"],
    })
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
  const tasks = await get.tasks({
    including: ["creator"],
  })
  return tasks
})

export const getUserByWalletAddress = createServerFn(
  "POST",
  async (data: { walletAddress: string }) => {
    const user = await get.user.with({
      walletAddress: data.walletAddress,
    })
    return user
  },
)

export const getPublicTasksAndUser = createServerFn(
  "POST",
  async (data: { walletAddress?: string }) => {
    const tasks = await get.tasks({
      including: ["creator"],
    })
    if (!data.walletAddress) {
      return {
        tasks,
      }
    }
    const user = await get.user.with({
      walletAddress: data.walletAddress,
    })
    return {
      tasks,
      user,
    }
  },
)

export const createAcceptTaskNotification = createServerFn(
  "POST",
  async (data: {
    taskId: string
    contractAddress: string
    recieverWalletAddress: string
    telegramUsernameOfInvestor: string
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
      // TODO: add current username tg name
      // @ts-ignore
      telegramUsernameOfInvestor: data.telegramUsernameOfInvestor,
    })
    return acceptTaskNotification
  },
)

export const contractStartedForTask = createServerFn(
  "POST",
  async (data: { contractAddress: string }) => {
    const acceptTaskNotification = await get.acceptTaskNotification.with({
      contractAddress: data.contractAddress,
    })
    if (!acceptTaskNotification)
      throw new Error("Accept task notification not found")
    const updatedAirdrop = await set.acceptTaskNotification({
      with: {
        contractAddress: data.contractAddress,
      },
      to: {
        accepted: true,
      },
    })
    console.log(updatedAirdrop, "updatedAirdrop")
  },
)

export const deleteTask = createServerFn(
  "POST",
  async (data: { taskId: string }) => {
    const deletedTask = await drop.task({
      with: {
        id: data.taskId,
      },
    })
    return deletedTask
  },
)

export const startWorkOnTask = createServerFn(
  "POST",
  async (data: {
    taskId: string
    investorWalletAddress: string
    workerTgUsername: string
    investorTgUsername: string
    taskName: string
  }) => {
    // const investor = await get.user.with({
    //   walletAddress: Address.parse(data.investorWalletAddress).toString(),
    // })
    // if (!investor) throw new Error("Investor not found")
    const updatedTask = await set.task({
      with: {
        id: data.taskId,
      },
      to: {
        // @ts-ignore
        workOnTaskHasStarted: true,
      },
    })
    try {
      const response = await fetch("http://94.241.141.207:13452/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hash: "aboba",
          users: [data.workerTgUsername, data.investorTgUsername],
          title: data.taskName,
        }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error creating chat:", error)
    }
    return updatedTask
  },
)
