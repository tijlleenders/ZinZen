import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

import archiveTune from "@assets/archive.mp3";
import { ITask, TaskAction } from "@src/Interfaces/Task";
import { displayToast, focusTaskTitle } from "@src/store";
import { TaskItem } from "@src/models/TaskItem";
import { displayReschedule } from "@src/store/TaskState";
import { getGoal } from "@src/api/GoalsAPI";
import { addTask, completeTask, getTaskByGoalId } from "@src/api/TasksAPI";

type TaskDetails = { [goalid: string]: TaskItem };

export const useMyTimelineStore = (
  day: string,
  taskDetails: TaskDetails,
  setTaskDetails: React.Dispatch<React.SetStateAction<TaskDetails>>,
) => {
  const navigate = useNavigate();

  const doneSound = new Audio(archiveTune);

  const setShowToast = useSetRecoilState(displayToast);
  const setTaskTitle = useSetRecoilState(focusTaskTitle);
  const setOpenReschedule = useSetRecoilState(displayReschedule);

  const addNewTask = async (task: ITask, action: TaskAction) => {
    const newTask = {
      id: uuidv4(),
      goalId: task.goalid,
      title: task.title,
      completedTodayIds: [],
      forgotToday: [],
      completedToday: action === TaskAction.Done ? Number(task.duration) : 0,
      lastForget: "",
      lastCompleted: action === TaskAction.Done ? new Date().toLocaleDateString() : "",
      hoursSpent: 0,
      completedTodayTimings:
        action === TaskAction.Done
          ? [
              {
                goalid: task.goalid,
                start: task.start,
                deadline: task.deadline,
              },
            ]
          : [],
      blockedSlots: [],
    };
    await addTask(newTask);
  };

  const handleOpenGoal = async (goalId: string) => {
    const goalsHistory = [];
    let tmpGoal = await getGoal(goalId);
    let openGoalId = tmpGoal?.parentGoalId;
    const parentGoalId = openGoalId;
    if (!openGoalId) return;

    while (openGoalId !== "root") {
      tmpGoal = await getGoal(openGoalId);
      if (!tmpGoal) break;
      goalsHistory.push({
        goalID: tmpGoal.id || "root",
        goalColor: tmpGoal.goalColor || "#ffffff",
        goalTitle: tmpGoal.title || "",
      });
      openGoalId = tmpGoal.parentGoalId;
    }
    goalsHistory.reverse();
    navigate("/goals", {
      state: {
        goalsHistory,
        activeGoalId: parentGoalId,
        expandedGoalId: goalId,
      },
    });
  };

  const handleFocusClick = (task: ITask) => {
    setTaskTitle(task.title);
    navigate("/", { state: { displayFocus: true } });
  };

  const handleActionClick = async (actionName: TaskAction, task: ITask) => {
    if (actionName === TaskAction.Goal) {
      return handleOpenGoal(task.goalid);
    }
    if (actionName === TaskAction.Focus) {
      return handleFocusClick(task);
    }
    if (day === "Today") {
      const taskItem = await getTaskByGoalId(task.goalid);
      if (!taskItem) {
        await addNewTask(task, actionName);
      } else if (actionName === TaskAction.Done) {
        const markDone = !!taskDetails[task.goalid]?.completedTodayIds.includes(task.taskid);
        if (markDone) return null;
        await completeTask(taskItem.id, Number(task.duration), task);
      } else if (actionName === TaskAction.NotNow) {
        setOpenReschedule(task);
      }
      if (actionName === TaskAction.Done) {
        await doneSound.play();
        const updatedTask = await getTaskByGoalId(task.goalid);
        if (updatedTask) {
          setTaskDetails((prev) => ({
            ...prev,
            [task.goalid]: updatedTask,
          }));
        }
      } else if (actionName === TaskAction.NotNow) {
        setOpenReschedule(task);
      }
    } else {
      setShowToast({ open: true, message: "Let's focus on Today :)", extra: "" });
    }
    return null;
  };

  return { handleActionClick, handleOpenGoal };
};
