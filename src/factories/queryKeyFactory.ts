// Query Keys Structure
export const GOAL_QUERY_KEYS = {
  all: ["goals"],
  lists: () => [...GOAL_QUERY_KEYS.all, "lists"],
  list: (filter: string, parentId: string) => [...GOAL_QUERY_KEYS.lists(), filter, parentId],
  details: () => [...GOAL_QUERY_KEYS.all, "detail"],
  detail: (goalId: string) => [...GOAL_QUERY_KEYS.details(), goalId],
} as const;
