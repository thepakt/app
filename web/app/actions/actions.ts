import { createServerFn } from "@tanstack/start"
import { get } from "ronin"
import { zodValidator } from "@tanstack/zod-adapter"
import { z } from "zod"

// TODO: have to to do ts-ignore due to latest version of server fn is strict with JSON serialization and RONIN does something weird
// https://discord.com/channels/719702312431386674/1309975248929685656

export const $getActiveTasksAndNotifications = createServerFn({
  method: "POST",
})
  .validator(zodValidator(z.object({ walletAddress: z.string() })))
  // @ts-ignore
  .handler(async ({ data }) => {
    const { walletAddress } = data
    const user = await get.user.with({
      walletAddress: data.walletAddress,
    })
    if (!user) throw new Error("User not found")
    const tasks = await get.tasks.with({
      creator: user,
    })
    const taskNotifications = await get.acceptTaskNotifications({
      including: ["task", "reciever"],
    })
    return {
      tasks,
      taskNotifications,
    }
  })

// export const $getActiveTasksAndNotifications = createServerFn({
//   method: "POST",
// }).handler(async (data: { walletAddress: string }) => {
//     const user = await get.user.with({
//       walletAddress: data.walletAddress,
//     })
//     if (!user) throw new Error("User not found")
//     const tasks = await get.tasks.with({
//       creator: user,
//     })
//     // const taskNotifications = await get.acceptTaskNotifications.with({
//     //   reciever: user.id,
//     // })
//     const taskNotifications = await get.acceptTaskNotifications({
//       including: ["task", "reciever"],
//     })
//     return {
//       tasks,
//       taskNotifications,
//     }
//       },
// )
