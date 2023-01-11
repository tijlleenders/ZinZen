/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TaskItem } from "@src/models/TaskItem";

import "./MyTimeline.scss";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";

interface Props {
  myTasks: TaskItem[],
  daysAfterToday: number
}

export const MyTimeline = ({ myTasks, daysAfterToday }: Props) => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState("root");
  const [visible, setVisible] = useState<boolean>(false);
  const today = new Date();
  const date = new Date();
  date.setDate(today.getDate() + daysAfterToday);

  const handleClick = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if (date.toDateString() === today.toDateString()) {
      setVisible(true);
    }
  }, []);

  return (
    visible
      ? (
        <div className={`MTL-display-${darkModeStatus ? "dark" : "light"}`}>
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            {date.toDateString()}
          </div>
          { myTasks.map((task) => (
            <div>
              <div style={{
                display: "flex" }}
              >
                <button
                  type="button"
                  className="MTL-circle"
                  style={{ backgroundColor: `${task.goalColor}` }}
                >.
                </button>
                <div style={{ marginLeft: "11px", color: `${task.goalColor}` }}>
                  <button
                    type="button"
                    className="MTL-taskTitle"
                    onClick={() => {
                      setDisplayOptionsIndex(task.goalid);
                      if (displayOptionsIndex === task.goalid) {
                        navigate("/MyGoals", { state: { isRootGoal: task.parentGoalId === "root", openGoalOfId: task.goalid } });
                      }
                    }}
                  >
                    {task.title}
                  </button>
                  <p className="MTL-goalTiming">
                    { task.start ? `${task.start.split("T")[1].slice(0, 2)}:00` : "" } - { task.deadline ? `${task.deadline.split("T")[1].slice(0, 2)}:00` : "" }
                  </p>
                </div>
              </div>
              { displayOptionsIndex === task.goalid ? (
                <div className="MTL-options">
                  <button type="button"> Forget</button><div />
                  <button type="button"> Reschedule</button><div />
                  <button type="button"> Done</button><div />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )
      : (
        <div className={`MTL-display-${darkModeStatus ? "dark" : "light"}`}>
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            {date.toDateString()}
          </div>
        </div>
      )
  );
};
