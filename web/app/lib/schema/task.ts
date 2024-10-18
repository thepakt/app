import { co, CoList, Encoders } from "jazz-tools"
import { BaseModel } from "./base"

// `bounty..` means it's part of the locked in bounty system for the todo

export class Task extends BaseModel {
  title = co.string
  notes = co.optional.string
  subtasks = co.optional.ref(SubTaskList)
  public = co.boolean
  completed = co.boolean
  bountyDueDate = co.optional.encoded(Encoders.Date)
  bountyPriceInUSDT = co.optional.number
}

export class SubTask extends BaseModel {
  title = co.string
  completed = co.boolean
}

export class SubTaskList extends CoList.Of(co.ref(SubTask)) {}
export class TaskList extends CoList.Of(co.ref(Task)) {}
