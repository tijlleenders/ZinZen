import React, { useEffect, useState } from "react";
import { ITask } from "@src/Interfaces/Task";
import { TaskItem } from "@src/models/TaskItem";
import "./index.scss";
import { getTimePart } from "@src/utils";
import { updateImpossibleGoals } from "./updateImpossibleGoals";
import { useMyTimelineStore } from "./useMyTimelineStore";
import TaskItemComponent from "./TaskItem";

type ImpossibleTaskId = string;

interface MyTimelineProps {
  day: string;
  taskDetails: { [goalid: string]: TaskItem };
  setTaskDetails: React.Dispatch<
    React.SetStateAction<{
      [goalid: string]: TaskItem;
    }>
  >;
  myTasks: {
    scheduled: ITask[];
    impossible: ImpossibleTaskId[];
    freeHrsOfDay: number;
    scheduledHrs: number;
  };
}

export const MyTimeline: React.FC<MyTimelineProps> = ({ day, myTasks, taskDetails, setTaskDetails }) => {
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState<string | null>(null);
  const { handleActionClick, handleOpenGoal } = useMyTimelineStore(day, taskDetails, setTaskDetails);

  useEffect(() => {
    updateImpossibleGoals(myTasks.impossible);
  }, [myTasks.impossible]);

  const handleToggleDisplayOptions = (task: ITask, isTaskCompleted: boolean) => {
    if (!isTaskCompleted) {
      return setDisplayOptionsIndex(displayOptionsIndex === task.taskid ? null : task.taskid);
    }
    return handleOpenGoal(task.goalid);
  };

  return (
    <div className="MTL-display" style={{ paddingTop: `${myTasks.scheduled.length > 0 ? "" : "1.125rem"}` }}>
      {myTasks.scheduled.map((task, index) => {
        const endTime = getTimePart(task.deadline);
        const nextTask = myTasks.scheduled[index + 1];
        const nextStartTime = getTimePart(nextTask?.start);
        const displayEndTime = endTime !== nextStartTime;
        const showTaskOptions = displayOptionsIndex === task.taskid;

        return (
          <React.Fragment key={task.taskid}>
            <TaskItemComponent
              task={task}
              handleActionClick={handleActionClick}
              isExpanded={showTaskOptions}
              onToggleExpand={handleToggleDisplayOptions}
              displayEndTime={displayEndTime}
              taskDetails={taskDetails}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
