import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState, currentScheduledTask, focusTaskTitle } from "@src/store";
import { Progress } from "antd";

import "./focus.scss";
import { formatTimeDisplay } from "@src/utils";

export const Focus = () => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const [initialTime, setInitialTime] = useState(25 * 60);
  const [time, setTime] = useState<number>(initialTime);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [userEnteredTime, setUserEnteredTime] = useState<string>("");
  const taskTitle = useRecoilValue(focusTaskTitle);
  const isActiveTitle = useRecoilValue(currentScheduledTask);

  useEffect(() => {
    let interval;
    if (isTimerActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isTimerActive && time !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isTimerActive, time]);

  const toggle = () => {
    setIsTimerActive(!isTimerActive);
  };
  const reset = () => {
    const resetTime = initialTime;
    setTime(resetTime);
    setIsTimerActive(false);
  };

  const percentage = ((initialTime - time) / initialTime) * 100;
  const { minutes, seconds } = formatTimeDisplay(time);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleSaveClick = () => {
    const newTimeInSeconds = parseInt(userEnteredTime, 10) * 60;
    if (!Number.isNaN(newTimeInSeconds)) {
      setInitialTime(newTimeInSeconds);
      setTime(newTimeInSeconds);
      setEditMode(false);
    } else setEditMode(false);
  };

  return (
    <div className="focus">
      <h6>{isActiveTitle === "" ? taskTitle : isActiveTitle}</h6>
      <Progress
        className={`progress-${darkModeStatus ? "dark" : ""}`}
        size={200}
        strokeColor="var(--icon-grad-2)"
        trailColor={darkModeStatus ? "#7e7e7e" : "var(--secondary-background)"}
        type="circle"
        percent={percentage}
        success={{ percent: 0, strokeColor: darkModeStatus ? "white" : "black" }}
        format={() => {
          const formattedMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
          return `${formattedMinutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }}
      />
      {editMode ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            className="default-input"
            style={{ textAlign: "center", maxWidth: 100 }}
            placeholder="minutes"
            value={userEnteredTime}
            onChange={(e) => setUserEnteredTime(e.target.value)}
          />
          <button className="action-btn" type="button" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="action-btn" type="button" onClick={toggle}>
            {isTimerActive ? "Pause" : "Start"}
          </button>
          <button className="action-btn" type="button" onClick={reset}>
            Reset
          </button>
          {time === initialTime && !isTimerActive && (
            <button className="action-btn" type="button" onClick={handleEditClick}>
              Edit Time
            </button>
          )}
        </div>
      )}
    </div>
  );
};
