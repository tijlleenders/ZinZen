import { Radio } from "antd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useState } from "react";

import { darkModeState, lastAction } from "@src/store";
import "./Reschedule.scss";
import ZModal from "@src/common/ZModal";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { displayReschedule } from "@src/store/TaskState";
import moment from "moment";
import { RESCHEDULE_OPTIONS } from "@src/constants/rescheduleOptions";

const Reschedule = () => {
  const [task, setOpen] = useRecoilState(displayReschedule);
  const [selectedOption, setSelectedOption] = useState(0);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setLastAction = useSetRecoilState(lastAction);

  if (!task) {
    return null;
  }

  const handleReschedule = (value: number) => {
    setSelectedOption(value);
    const now = moment();
    const futureMoment = now.clone().add(value, "hours");

    const start = now.format().slice(0, 19);
    const end = futureMoment.format().slice(0, 19);

    addBlockedSlot(task.goalid, {
      start,
      end,
    });

    console.log(`Task to avoid scheduling from ${start} to ${end}`);
    setOpen(null);
    setLastAction("TaskRescheduled");
  };

  return (
    <ZModal
      type={`reschedule-modal ${darkModeStatus ? "dark" : "light"}`}
      open={!!task.title}
      onCancel={() => setOpen(null)}
    >
      <div className="header-title">
        <h4>{task.title}</h4>
      </div>
      <div className="reschedule-options">
        <Radio.Group
          size="large"
          buttonStyle="solid"
          defaultValue={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {RESCHEDULE_OPTIONS.map((option) => (
            <Radio.Button
              className={`radio-button ${darkModeStatus ? "dark" : "light"}`}
              style={{
                backgroundColor: darkModeStatus ? "rgba(255, 255, 255, 0.08)" : "var(--secondary-background)",
              }}
              key={option.label}
              value={option.value}
            >
              {option.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <div>
        <button type="button" className="action-btn" onClick={() => handleReschedule(selectedOption)}>
          Reschedule
        </button>
      </div>
    </ZModal>
  );
};

export default Reschedule;
