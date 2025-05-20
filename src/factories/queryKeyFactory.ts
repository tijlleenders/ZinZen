// Query Keys Structure
export const GOAL_QUERY_KEYS = {
  all: ["goals"],
  lists: () => [...GOAL_QUERY_KEYS.all, "lists"],
  list: (filter: string, parentId: string) => [...GOAL_QUERY_KEYS.lists(), filter, parentId],
  details: () => [...GOAL_QUERY_KEYS.all, "detail"],
  detail: (goalId: string) => [...GOAL_QUERY_KEYS.details(), goalId],
} as const;

export const SHARED_WM_GOAL_QUERY_KEYS = {
  all: ["sharedWMGoals"],
  lists: () => [...SHARED_WM_GOAL_QUERY_KEYS.all, "lists"],
  list: (filter: string, parentId: string) => [...SHARED_WM_GOAL_QUERY_KEYS.lists(), filter, parentId],
  details: () => [...SHARED_WM_GOAL_QUERY_KEYS.all, "detail"],
  detail: (goalId: string) => [...SHARED_WM_GOAL_QUERY_KEYS.details(), goalId],
} as const;
