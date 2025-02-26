import { useRecoilState, useSetRecoilState } from "recoil";
import React, { useEffect, useState } from "react";

import { lastAction } from "@src/store";
import "./NotNowModal.scss";
import ZModal from "@src/common/ZModal";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { displayReschedule } from "@src/store/TaskState";
import { MILLISECONDS_IN_HOUR, RESCHEDULE_OPTIONS } from "@src/constants/rescheduleOptions";
import { convertDateToString } from "@src/utils";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { getGoalById } from "@src/api/GoalsAPI";
import forgetTune from "@assets/forget.mp3";
import { addTaskActionEvent } from "@src/api/TaskHistoryAPI";
import { addTaskDoneToday } from "@src/api/TasksDoneTodayAPI";
import { TaskActions } from "@src/constants/actions";

const NotNowModal = () => {
  const [task, setDisplayReschedule] = useRecoilState(displayReschedule);
  const setLastAction = useSetRecoilState(lastAction);
  const [showSkip, setShowSkip] = useState(false);

  const forgetSound = new Audio(forgetTune);

  useEffect(() => {
    const checkGoalCategory = async () => {
      if (task?.goalid) {
        const goal = await getGoalById(task.goalid);
        if (goal?.category === "Budget") {
          setShowSkip(true);
        } else {
          setShowSkip(false);
        }
      }
    };
    checkGoalCategory();
  }, [task]);

  if (!task) return null;

  const handleReschedule = async (hours: number) => {
    const startTime = new Date(task.start);
    const endTime = new Date(startTime.getTime() + hours * MILLISECONDS_IN_HOUR);
    const start = convertDateToString(startTime, false);
    const end = convertDateToString(endTime, false);

    addBlockedSlot(task.goalid, {
      start,
      end,
    });
    await addTaskActionEvent(task, "postponed");

    console.log(`Task rescheduled from ${start} to ${end}`);
    setDisplayReschedule(null);
    setLastAction(TaskActions.TASK_RESCHEUDLED);
  };

  const handleSkip = async () => {
    await addTaskDoneToday({
      scheduledTaskId: task.taskid,
      scheduledStart: task.start,
      scheduledEnd: task.deadline,
      goalId: task.goalid,
    });
    await addTaskActionEvent(task, "skipped");
    setDisplayReschedule(null);
    setLastAction(TaskActions.TASK_SKIPPED);
    forgetSound.play();
  };

  return (
    <ZModal type="reschedule-modal interactables-modal" open={!!task.title} onCancel={() => setDisplayReschedule(null)}>
      <div className="header-title">
        <p className="ordinary-element">{`Not now: ${task.title}`}</p>
      </div>
      <div className="reschedule-options">
        {RESCHEDULE_OPTIONS.map((option) => (
          <div
            key={option.value}
            className="goal-action shareOptions-btn"
            onClickCapture={() => handleReschedule(option.value)}
          >
            <ActionDiv label={option.label} icon="Clock" />
          </div>
        ))}

        {showSkip && (
          <div className="goal-action shareOptions-btn" onClickCapture={handleSkip}>
            <ActionDiv label="Skip" icon="Clock" />
          </div>
        )}
      </div>
    </ZModal>
  );
};

export default NotNowModal;
