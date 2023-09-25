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
  const taskTitle = location.state?.taskTitle || "Task Name";

  const [initialTime] = useState(0.5 * 60); // Initial time in seconds
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
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
    setTime(initialTime);
    setIsActive(false);
  };
  const percentage = ((initialTime - time) / initialTime) * 100;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <AppLayout title="Focus">
      <SubHeader title={taskTitle} leftNav={() => {}} rightNav={() => {}} showLeftNav={false} showRightNav={false} />
      <div className="FocusPage" style={{ color: darkModeStatus ? "white" : "black" }}>
        <Progress
          strokeColor={darkModeStatus ? "white" : "var(--primary-background)"}
          trailColor="var(--selection-color)"
          type="circle"
          percent={percentage}
          success={{ percent: 0, strokeColor: darkModeStatus ? "white" : "black" }}
          format={() => `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="action-btn" type="button" onClick={toggle}>
            {isActive ? "Pause" : "Start"}
          </button>
          <button className="action-btn" type="button" onClick={reset}>
            {" "}
            Reset{" "}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};
