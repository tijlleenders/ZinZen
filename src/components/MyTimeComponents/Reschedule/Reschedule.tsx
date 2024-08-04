import { useRecoilState, useSetRecoilState } from "recoil";
import React from "react";

import { lastAction } from "@src/store";
import "./Reschedule.scss";
import ZModal from "@src/common/ZModal";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { displayReschedule } from "@src/store/TaskState";
import { MILLISECONDS_IN_HOUR, RESCHEDULE_OPTIONS } from "@src/constants/rescheduleOptions";
import { convertDateToString } from "@src/utils";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";

const Reschedule = () => {
  const [task, setDisplayReschedule] = useRecoilState(displayReschedule);
  const setLastAction = useSetRecoilState(lastAction);

  if (!task) return null;

  const handleReschedule = (hours: number) => {
    const startTime = new Date(task.start);
    const endTime = new Date(startTime.getTime() + hours * MILLISECONDS_IN_HOUR);
    const start = convertDateToString(startTime, false);
    const end = convertDateToString(endTime, false);

    addBlockedSlot(task.goalid, {
      start,
      end,
    });

    console.log(`Task rescheduled from ${start} to ${end}`);
    setDisplayReschedule(null);
    setLastAction("TaskRescheduled");
  };

  const handleSkip = () => {
    console.log("Task skipped");
    setDisplayReschedule(null);
    setLastAction("TaskSkipped");
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

        <div className="goal-action shareOptions-btn" onClickCapture={handleSkip}>
          <ActionDiv label="Skip" icon="Skip" />
        </div>
      </div>
    </ZModal>
  );
};

export default Reschedule;
