import { Radio } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { darkModeState } from "@src/store";
import "./Reschedule.scss";
import ZModal from "@src/common/ZModal";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { displayReschedule } from "@src/store/TaskState";
import moment from "moment";

const Reschedule = () => {
  const [task, setOpen] = useRecoilState(displayReschedule);
  const [selectedOption, setSelectedOption] = useState(0);
  const darkModeStatus = useRecoilValue(darkModeState);

  if (!task) {
    return null;
  }

  const rescheduleOptions = [
    { label: "1 hour", value: 1 },
    { label: "3 hours", value: 3 },
    { label: "1 day", value: 24 },
    { label: "3 days", value: 72 },
    { label: "7 days", value: 168 },
  ];

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
  };

  return (
    <ZModal type="rescheduleModal" open={!!task} onCancel={() => setOpen(null)}>
      <div className="header-title">
        <h4>{task.title}</h4>
      </div>
      <div
        className={`reschedule-options ${darkModeStatus ? "dark" : "light"}`}
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <Radio.Group
          size="large"
          buttonStyle="solid"
          defaultValue={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          {rescheduleOptions.map((option) => (
            <Radio.Button
              style={{
                backgroundColor: darkModeStatus ? "rgba(255, 255, 255, 0.08)" : "var(--secondary-background)",
              }}
              key={uuidv4()}
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
