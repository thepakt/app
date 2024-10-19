import { CoMap, co, Account, Profile } from "jazz-tools"
import { TaskList } from "./task"

export class UserRoot extends CoMap {
  version = co.optional.number
  walletAddress = co.string // auth method (for now)
  tasks = co.ref(TaskList)
  investingInTodos = co.ref(TaskList)
  // TODO: can be derived..
  // successfullyCompletedTasks = co.ref(TaskList)
  // unsuccessfullyCompletedTasks = co.ref(TaskList)
}

export class LaAccount extends Account {
  profile = co.ref(Profile)
  root = co.ref(UserRoot)

  migrate(
    this: LaAccount,
    creationProps?: { name: string; avatarUrl?: string },
  ) {
    super.migrate(creationProps)

    if (!this._refs.root && creationProps) {
      this.root = UserRoot.create(
        {
          walletAddress: creationProps.name,
          tasks: TaskList.create([], { owner: this }),
          investingInTodos: TaskList.create([], { owner: this }),

          version: 1,
        },
        { owner: this },
      )
      throw new Error("err")
    }
  }
}
