import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import SubHeader from "@src/common/SubHeader";
import AppLayout from "@src/layouts/AppLayout";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Progress } from "antd";

import "./focusPage.scss";

export const FocusPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const location = useLocation();
  const taskTitle = location.state?.taskTitle || "Task";

  const [initialTime] = useState(0.5 * 60); // Default initial time in seconds
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [userEnteredTime, setUserEnteredTime] = useState(null);
  const [timeFormat, setTimeFormat] = useState("MM");

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
    const resetTime = userEnteredTime !== null ? userEnteredTime : initialTime;
    setTime(resetTime);
    setIsActive(false);
  };

  const percentage = ((initialTime - time) / initialTime) * 100;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    const timeParts = newTime.split(":");
    let newTimeInSeconds;
    if (timeParts.length === 2) {
      // HH:MM format
      newTimeInSeconds = parseInt(timeParts[0], 10) * 60 * 60 + parseInt(timeParts[1], 10) * 60;
      setTimeFormat("HH:MM");
    } else {
      // MM format
      newTimeInSeconds = parseInt(timeParts[0], 10) * 60;
      setTimeFormat("MM");
    }
    if (!Number.isNaN(newTimeInSeconds)) {
      setUserEnteredTime(newTimeInSeconds);
      setTime(newTimeInSeconds);
      setEditMode(false);
    } else setEditMode(false);
  };

  return (
    <AppLayout title="Focus">
      <SubHeader title={taskTitle} leftNav={() => {}} rightNav={() => {}} showLeftNav={false} showRightNav={false} />
      <div className="FocusPage">
        <Progress
          className={`progress-${darkModeStatus ? "dark" : ""}`}
          size={200}
          strokeColor={darkModeStatus ? "white" : "var(--header-color)"}
          trailColor="var(--selection-color)"
          type="circle"
          percent={percentage}
          success={{ percent: 0, strokeColor: darkModeStatus ? "white" : "black" }}
          format={() =>
            timeFormat === "HH:MM"
              ? `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
                  seconds < 10 ? "0" : ""
                }${seconds}`
              : `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
          }
        />
        {editMode ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <input
              className="default-input"
              style={{ textAlign: "center", maxWidth: 100 }}
              placeholder="HH:MM or MM"
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
    </AppLayout>
  );
};
