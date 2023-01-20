export interface UpdatePublicGroupGoalItem {
    id : string,
    parentId: string,
    title: string,
    likeScore: -1 | 0 | 1,
    feelingScore: -1 | 0 | 1,
    inMyGoals: boolean,
    completed: boolean
  }
