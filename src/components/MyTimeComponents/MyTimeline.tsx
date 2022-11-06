/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TaskItem } from "@src/models/TaskItem";

import "./MyTimeline.scss";

export const MyTimeline = ({ myTasks }: {myTasks: TaskItem[]}) => {
  const navigate = useNavigate();
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState(-1);

  const getBreakingPoint = (GoalID:number) => {
    setDisplayOptionsIndex(myTasks.findIndex((task) => task.goalid === GoalID));
  };
  const handleDisplayOptions = (task: TaskItem) => {
    getBreakingPoint(task.goalid ? task.goalid : -1);
  };
  const getTimeComponents = (vbarUp: boolean, tasks: TaskItem[]) => (
    <div id="MTL-times">
      {vbarUp && <div className="bar" />}
      {tasks.map((task: TaskItem) => (
        <>
          <button
            type="button"
            onClick={() => handleDisplayOptions(task)}
            className="MTL-startTime"
          >
            {`${task.start.split("T")[1].slice(0, 2)}:00`}
          </button>
          <div className="bar" />
        </>
      ))}
    </div>
  );
  const getCircleComponents = (vbarUp: boolean, tasks: TaskItem[]) => (
    <div id="MTL-circles">
      {vbarUp && <div className="vbar" />}
      {tasks.map((task: TaskItem, index: number) => (
        <>
          <button
            type="button"
            className="MTL-circle"
            style={{ backgroundColor: `${task.goalColor}` }}
            onClick={() => handleDisplayOptions(task)}
          >.
          </button>
          <div
            style={{ display: `${(vbarUp && tasks.length - 1 === index) || (index === myTasks.length - 1) ? "none" : "block"}` }}
            className="vbar"
          />
        </>
      ))}
    </div>
  );
  const getTitleComponents = (vbarUp: boolean, tasks: TaskItem[]) => (
    <div id="MTL-titles">
      {vbarUp && <div className="bar" />}
      {tasks.map((task: TaskItem) => (
        <>
          <button
            type="button"
            className="MTL-taskTtitle"
            onClick={() => handleDisplayOptions(task)}
          >
            {task.title}
          </button>
          <div className="bar" />
        </>
      ))}
    </div>
  );
  const showOptions = (task: TaskItem) => (
    <div className="MTL-options_container">
      <div
        className="MTL-options-task"
        onClickCapture={() => {
          navigate("/Home/MyGoals", { state: { isRootGoal: task.parentGoalId === -1, openGoalOfId: task.goalid } });
        }}
      >
        <div className="MTL-circle" style={{ color: task.goalColor }} />
        <div className="MTL-options-title">{task.title}</div>
      </div>
      <div className="MTL-options">
        <button type="button"> Forget</button>
        <button type="button"> Reschedule</button>
        <button type="button"> Done</button>
      </div>
    </div>
  );
  const renderTimeline = (vbarUp: boolean, start: number, end: number = myTasks.length) => (
    <>
      <div>{getTimeComponents(vbarUp, myTasks.slice(start, end))}</div>
      <div>{getCircleComponents(vbarUp, myTasks.slice(start, end))}</div>
      <div style={{ paddingLeft: "1vh", width: "100%" }}>{getTitleComponents(vbarUp, myTasks.slice(start, end))}</div>
    </>
  );
  return (
    <div id={`MTL-display${displayOptionsIndex !== -1 ? "-withOption" : ""}`}>
      {displayOptionsIndex !== -1 ? (
        <>
          <div style={{ display: "flex" }}>{renderTimeline(false, 0, displayOptionsIndex)}</div>
          {showOptions(myTasks[displayOptionsIndex])}
          { displayOptionsIndex + 1 < myTasks.length && <div style={{ display: "flex", width: "100%" }}>{renderTimeline(true, displayOptionsIndex + 1)}</div>}
        </>
      ) : renderTimeline(false, 0, myTasks.length)}
    </div>
  );
};
