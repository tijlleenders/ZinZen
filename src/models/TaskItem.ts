export interface TaskItem {
    taskid: number;
    goalid: number;
    title: string;
    duration: number;
    start: string;
    deadline: string;
    goalColor: string;
    parentGoalId: number;
}
