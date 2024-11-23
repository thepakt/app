import { createServerFn } from "@tanstack/start"

export const $createTask = createServerFn({ method: "POST" }).handler(
  async () => {
    return { message: "test" }
  },
)

export const $deleteTask = createServerFn({ method: "POST" }).handler(
  async () => {
    return { message: "test" }
  },
)

export const $getUserByWalletAddress = createServerFn({
  method: "POST",
}).handler(async () => {
  return { message: "test" }
})
