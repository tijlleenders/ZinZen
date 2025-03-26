export interface blockedSlotOfTask {
  start: string;
  end: string;
}
export interface TaskItem {
  id: string;
  goalId: string;
  title: string;
  blockedSlots: blockedSlotOfTask[];
}
