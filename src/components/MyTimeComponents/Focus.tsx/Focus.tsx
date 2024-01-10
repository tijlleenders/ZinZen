import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState, focusTaskTitle } from "@src/store";
import { Progress } from "antd";

import "./focus.scss";
import { formatTimeDisplay } from "@src/utils";
import { useTranslation } from "react-i18next";

export const Focus = () => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  const [initialTime, setInitialTime] = useState(25 * 60);
  const [time, setTime] = useState<number>(initialTime);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [userEnteredTime, setUserEnteredTime] = useState<string>("");
  const taskTitle = useRecoilValue(focusTaskTitle);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isTimerActive && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerActive, time]);

  const toggle = () => {
    setIsTimerActive(!isTimerActive);
  };
  const reset = () => {
    setTime(initialTime);
    setIsTimerActive(false);
  };

  const percentage = ((initialTime - time) / initialTime) * 100;
  const { minutes, seconds } = formatTimeDisplay(time);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleSaveClick = () => {
    const newTimeInSeconds = parseInt(userEnteredTime, 10) * 60;
    if (!Number.isNaN(newTimeInSeconds) && newTimeInSeconds > 0) {
      setInitialTime(newTimeInSeconds);
      setTime(newTimeInSeconds);
    }
    setEditMode(false);
  };

  return (
    <div className="focus">
      <h6>{t(`${taskTitle}`)}</h6>
      <Progress
        className={`progress-${darkModeStatus ? "dark" : ""}`}
        size={200}
        strokeColor="var(--icon-grad-2)"
        trailColor={darkModeStatus ? "#7e7e7e" : "var(--secondary-background)"}
        type="circle"
        percent={percentage}
        success={{ percent: 0, strokeColor: darkModeStatus ? "white" : "black" }}
        format={() => {
          if (minutes >= 1) {
            return `${minutes} ${t("min")}`;
          }
          return `${seconds} ${t("sec")}`;
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
            {t("save")}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="action-btn" type="button" onClick={toggle}>
            {isTimerActive ? `${t("pause")}` : `${t("start")}`}
          </button>
          <button className="action-btn" type="button" onClick={reset}>
            {t("reset")}
          </button>
          {time === initialTime && !isTimerActive && (
            <button className="action-btn" type="button" onClick={handleEditClick}>
              {t("editTime")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
