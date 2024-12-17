export interface blockedSlotOfTask {
  start: string;
  end: string;
}

export type TCompletedTaskTiming = { goalid: string; start: string; deadline: string };
export interface TaskItem {
  id: string;
  goalId: string;
  title: string;
  completedToday: number;
  completedTodayIds: string[];
  skippedToday: string[];
  blockedSlots: blockedSlotOfTask[];
}
