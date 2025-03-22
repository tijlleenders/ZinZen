import { useRecoilState } from "recoil";
import React, { useState } from "react";

import "./NotNowModal.scss";
import ZModal from "@src/common/ZModal";
import { displayReschedule } from "@src/store/TaskState";
import { MILLISECONDS_IN_HOUR, RESCHEDULE_OPTIONS } from "@src/constants/rescheduleOptions";
import { convertDateToString } from "@src/utils";
import ActionDiv from "@components/GoalsComponents/MyGoalActions/ActionDiv";
import { getGoalById } from "@src/api/GoalsAPI";
import { useSkipTask } from "@src/hooks/api/Tasks/useSkipTask";
import { useRescheduleTask } from "@src/hooks/api/Tasks/useRescheduleTask";
import { ITask } from "@src/Interfaces/Task";

const NotNowModal = () => {
  const [task, setDisplayReschedule] = useRecoilState(displayReschedule);
  const [showSkip, setShowSkip] = useState(false);

  const { skipTaskMutation } = useSkipTask();
  const { rescheduleTaskMutation } = useRescheduleTask(task as ITask);

  if (task?.goalid && !showSkip) {
    getGoalById(task.goalid).then((goal) => {
      setShowSkip(goal?.category === "Budget");
    });
  }

  if (!task) return null;

  const handleReschedule = async (hours: number) => {
    const startTime = new Date(task.start);
    const endTime = new Date(startTime.getTime() + hours * MILLISECONDS_IN_HOUR);
    const start = convertDateToString(startTime, false);
    const end = convertDateToString(endTime, false);

    rescheduleTaskMutation({ start, end });
  };

  const handleSkip = async () => {
    skipTaskMutation(task);
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
