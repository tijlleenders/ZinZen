import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import { Progress } from "antd";

import "./focus.scss";
import { formatTimeDisplay } from "@src/utils";

export const Focus = () => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const [initialTime, setInitialTime] = useState(25 * 60);
  const [time, setTime] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newTime, setNewTime] = useState<string>("");

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, time]);

  const toggle = () => {
    setIsActive(!isActive);
  };
  const reset = () => {
    const resetTime = initialTime;
    setTime(resetTime);
    setIsActive(false);
  };

  const percentage = ((initialTime - time) / initialTime) * 100;
  const { minutes, seconds } = formatTimeDisplay(time);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleSaveClick = () => {
    const newTimeInSeconds = parseInt(newTime, 10) * 60;
    if (!Number.isNaN(newTimeInSeconds)) {
      setInitialTime(newTimeInSeconds);
      setTime(newTimeInSeconds);
      setEditMode(false);
    } else setEditMode(false);
  };

  return (
    <div className="Focus">
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
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <button className="action-btn" type="button" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="action-btn" type="button" onClick={toggle}>
            {isActive ? "Pause" : "Start"}
          </button>
          <button className="action-btn" type="button" onClick={reset}>
            Reset
          </button>
          {time === initialTime && !isActive && (
            <button className="action-btn" type="button" onClick={handleEditClick}>
              Edit Time
            </button>
          )}
        </div>
      )}
    </div>
  );
};
