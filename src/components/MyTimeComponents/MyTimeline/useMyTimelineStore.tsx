import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

import archiveTune from "@assets/archive.mp3";
import { ITask, TaskAction } from "@src/Interfaces/Task";
import { displayToast, focusTaskTitle, lastAction } from "@src/store";
import { displayReschedule } from "@src/store/TaskState";
import { getGoal } from "@src/api/GoalsAPI";
import { addTask, getTaskByGoalId } from "@src/api/TasksAPI";
import { completeTask } from "@src/controllers/TaskDoneTodayController";
import { addTaskActionEvent } from "@src/api/TaskHistoryAPI";
import { GoalItem } from "@src/models/GoalItem";
import { ILocationState } from "@src/Interfaces";
import { ISubGoalHistory } from "@src/store/GoalsState";

export const useMyTimelineStore = (day: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const setLastAction = useSetRecoilState(lastAction);

  const doneSound = new Audio(archiveTune);

  const setShowToast = useSetRecoilState(displayToast);
  const setTaskTitle = useSetRecoilState(focusTaskTitle);
  const setOpenReschedule = useSetRecoilState(displayReschedule);

  const handleOpenGoal = async (goalId: string) => {
    const goalsHistory: ISubGoalHistory[] = [];
    let tmpGoal: GoalItem | null = await getGoal(goalId);
    let openGoalId = tmpGoal?.parentGoalId;
    const parentGoalId = openGoalId;
    if (!openGoalId) return;
    while (openGoalId !== "root") {
      // eslint-disable-next-line no-await-in-loop
      tmpGoal = await getGoal(openGoalId);
      if (!tmpGoal) break;
      goalsHistory.push({
        goalID: tmpGoal.id ?? "root",
        goalColor: tmpGoal.goalColor ?? "#ffffff",
        goalTitle: tmpGoal.title ?? "",
      });
      openGoalId = tmpGoal.parentGoalId;
    }
    goalsHistory.reverse();
    const newState: ILocationState = {
      ...location.state,
      expandedGoalId: goalId,
      goalsHistory,
    };
    navigate(`/goals${parentGoalId === "root" ? "" : `/${parentGoalId}`}`, { state: newState });
  };

  const handleFocusClick = (task: ITask) => {
    setTaskTitle(task.title);
    navigate("/", { state: { displayFocus: true } });
  };

  const handleDoneClick = async (task: ITask) => {
    await completeTask(task.taskid, task.goalid, task.start, task.deadline);
    await addTaskActionEvent(task, "completed");
    await doneSound.play();
    setLastAction("TaskCompleted");
  };

  const handleActionClick = async (actionName: TaskAction, task: ITask) => {
    if (actionName === TaskAction.Goal) {
      return handleOpenGoal(task.goalid);
    }
    if (actionName === TaskAction.Focus) {
      return handleFocusClick(task);
    }
    if (actionName === TaskAction.Done) {
      return handleDoneClick(task);
    }
    if (actionName === TaskAction.NotNow) {
      return setOpenReschedule({ ...task });
    }
    if (day === "Today") {
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        console.log("task not found");

        await addTask({
          id: uuidv4(),
          goalId: task.goalid,
          title: task.title,
          completedTodayIds: [],
          skippedToday: [],
          completedToday: 0,
          lastSkipped: "",
          lastCompleted: "",
          hoursSpent: 0,
          blockedSlots: [],
        });
      }
    } else {
      setShowToast({ open: true, message: "Let's focus on Today :)", extra: "" });
    }
    return null;
  };

  return { handleActionClick, handleOpenGoal };
};
