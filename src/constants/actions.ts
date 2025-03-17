/* eslint-disable no-shadow */
export enum GoalActions {
  GOAL_SAVED = "goalSaved",
  GOAL_DELETED = "goalDeleted",
  GOAL_ARCHIVED = "goalArchived",
  GOAL_UNARCHIVED = "goalUnarchived",
  GOAL_RESTORED = "goalRestored",
  GOAL_ITEM_CREATED = "goalItemCreated",
  GOALS_RESTORED = "goalsRestored",
  GOAL_CHANGES_SYNCED = "goalChangesSynced",
  GOAL_NEW_UPDATES = "goalNewUpdates",
  GOAL_COLAB_REQUEST = "goalColabRequest",
  GOAL_UPDATED = "goalUpdated",
}

export enum GoalHintActions {
  GOAL_HINT_REPORTED = "goalHintReported",
  GOAL_HINT_DELETED = "goalHintDeleted",
  GOAL_HINT_ADDED = "goalHintAdded",
}

export enum TaskActions {
  TASK_COMPLETED = "taskCompleted",
  TASK_RESCHEUDLED = "taskRescheduled",
  TASK_SKIPPED = "taskSkipped",
  TASK_COLLECTION_REFRESHED = "taskCollectionRefreshed",
}
