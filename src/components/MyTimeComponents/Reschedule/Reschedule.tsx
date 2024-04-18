import { Radio, Tooltip } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { darkModeState } from "@src/store";
import "./Reschedule.scss";
import ZModal from "@src/common/ZModal";
import { updateGoal } from "@src/api/GoalsAPI";
import { TaskItem } from "@src/models/TaskItem";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { displayReschedule } from "@src/store/TaskState";

const Reschedule = () => {
  const [task, setOpen] = useRecoilState(displayReschedule);
  const [selectedOption, setSelectedOption] = useState(null);
  console.log(task);
  if (!task) {
    return null;
  }

  const rescheduleOptions = [
    { label: "1 hour", value: 1 },
    { label: "3 hours", value: 3 },
    { label: "1 day", value: 24 },
    { label: "3 days", value: 72 },
    { label: "7 days", value: 168 },
    { label: "30 days", value: 720 },
  ];

  // Function to update `notOn` field based on selected reschedule option
  const handleReschedule = (value) => {
    setSelectedOption(value);
    const now = new Date(); // Get the current date and time
    // Convert current time to UTC by subtracting the timezone offset
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

    // Zero out UTC minutes, seconds, and milliseconds to align with the start of the hour
    utcNow.setUTCHours(utcNow.getUTCHours(), 0, 0, 0);

    const futureDate = new Date(utcNow.getTime() + value * 3600000); // Compute the future date in UTC

    // Calculate `notOnStart` and `notOnEnd` to match exact hours in UTC
    const notOnStart = new Date(utcNow.getTime());
    const notOnEnd = new Date(futureDate.getTime());

    // Call to add blocked slot in the scheduling system with UTC dates
    addBlockedSlot(task.goalid, {
      start: notOnStart.toISOString(), // This will naturally be in UTC
      end: notOnEnd.toISOString(), // This will naturally be in UTC
    });

    console.log(`Task to avoid scheduling from ${notOnStart.toISOString()} to ${notOnEnd.toISOString()}`);
    setOpen(null); // Close the modal after setting the notOn field
  };

  return (
    <ZModal type="rescheduleModal" open={!!task.taskid} onCancel={() => setOpen(null)}>
      <div className="header-title">
        <h4>{task.title}</h4>
      </div>
      <div className="list" style={{ display: "flex", flexWrap: "wrap" }}>
        <Radio.Group defaultValue={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          {rescheduleOptions.map((option) => (
            <Radio.Button key={uuidv4()} value={option.value}>
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
