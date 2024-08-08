import { useRecoilState, useSetRecoilState } from "recoil";
import React, { useEffect, useState } from "react";

import { lastAction } from "@src/store";
import "./NotNowModal.scss";
import ZModal from "@src/common/ZModal";
import { addBlockedSlot } from "@src/api/TasksAPI"; // Assume getGoalById exists
import { displayReschedule } from "@src/store/TaskState";
import { MILLISECONDS_IN_HOUR, RESCHEDULE_OPTIONS } from "@src/constants/rescheduleOptions";
import { convertDateToString } from "@src/utils";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { getGoalById } from "@src/api/GoalsAPI";

const NowNowModal = () => {
  const [task, setDisplayReschedule] = useRecoilState(displayReschedule);
  const setLastAction = useSetRecoilState(lastAction);
  const [showSkip, setShowSkip] = useState(false);

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

        {showSkip && (
          <div className="goal-action shareOptions-btn" onClickCapture={handleSkip}>
            <ActionDiv label="Skip" icon="Clock" />
          </div>
        )}
      </div>
    </ZModal>
  );
};

export default NowNowModal;
