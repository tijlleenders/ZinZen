export interface ICollaboration {
    status: "none" | "pending" | "accepted" | "declined",
    newUpdates: boolean,
    relId: string,
    name: string,
    rootGoal: string,
    notificationCounter: number,
    allowed: boolean
  }
