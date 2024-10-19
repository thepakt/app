import { co, CoList, Encoders } from "jazz-tools"
import { BaseModel } from "./base"

// `bounty..` means it's part of the locked in bounty system for the todo

export class Task extends BaseModel {
  title = co.string
  completed = co.boolean
  notes = co.optional.string
  subtasks = co.ref(CoList.Of(SubTask))
  public = co.boolean
  bountyEstimatedTimeInHours = co.optional.number // 24 (means 1 day)
  bountyPriceInUSDT = co.optional.number
}

export class SubTask extends BaseModel {
  title = co.string
  completed = co.boolean
}

export class SubTaskList extends CoList.Of(co.ref(SubTask)) {}
export class TaskList extends CoList.Of(co.ref(Task)) {}
