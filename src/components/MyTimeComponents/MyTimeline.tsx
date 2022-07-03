/* eslint-disable react/jsx-key */
import React, { useState } from "react";

import { GoalItem } from "@src/models/GoalItem";

import "./MyTimeline.scss";

export const MyTimeline = ({ myTasks }: {myTasks: GoalItem[]}) => {
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState(-1);
  const getBreakingPoint = (GoalID:number) => {
    setDisplayOptionsIndex(myTasks.findIndex((task) => task.id === GoalID));
  };
  const handleDisplayOptions = (task: GoalItem) => {
    getBreakingPoint(task.id ? task.id : -1);
  };
  const getTimeComponents = (vbarUp: boolean, tasks: GoalItem[]) => (
    <div id="MTL-times">
      {vbarUp && <div className="bar" />}
      {tasks.map((task: GoalItem) => (
        <>
          <button
            type="button"
            onClick={() => handleDisplayOptions(task)}
            className="MTL-startTime"
          >
            {task.start?.toTimeString().slice(0, 5)}
          </button>
          <div className="bar" />
        </>
      ))}
    </div>
  );
  const getCircleComponents = (vbarUp: boolean, tasks: GoalItem[]) => (
    <div id="MTL-circles">
      {vbarUp && <div className="vbar" />}
      {tasks.map((task: GoalItem, index: number) => (
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
  const getTitleComponents = (vbarUp: boolean, tasks: GoalItem[]) => (
    <div id="MTL-titles">
      {vbarUp && <div className="bar" />}
      {tasks.map((task: GoalItem) => (
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
  const showOptions = (task: GoalItem) => (
    <div className="MTL-options_container">
      <div className="MTL-options-task">
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
      <div style={{ paddingLeft: "1vh" }}>{getTitleComponents(vbarUp, myTasks.slice(start, end))}</div>
    </>
  );
  return (
    <div id={`MTL-display${displayOptionsIndex !== -1 ? "-withOption" : ""}`}>
      {displayOptionsIndex !== -1 ? (
        <>
          <div style={{ display: "flex" }}>{renderTimeline(false, 0, displayOptionsIndex)}</div>
          {showOptions(myTasks[displayOptionsIndex])}
          { displayOptionsIndex + 1 < myTasks.length && <div style={{ display: "flex" }}>{renderTimeline(true, displayOptionsIndex + 1)}</div>}
        </>
      ) : renderTimeline(false, 0, myTasks.length)}
    </div>
  );
};
