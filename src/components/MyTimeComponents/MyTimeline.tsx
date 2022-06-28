/* eslint-disable react/jsx-key */
import React, { useState } from "react";

import { GoalItem } from "@src/models/GoalItem";

import "./MyTimeline.scss";

export const MyTimeline = ({ myTasks }: {myTasks: GoalItem[]}) => {
  const [displayOptionsIndex, setDisplayOptionsIndex] = useState(-1);
  const getTimeComponents = (tasks: GoalItem[]) => (
    <div id="MTL-times">
      {tasks.map((task: GoalItem) => {
        const time = task.start?.toLocaleTimeString();
        return (
          <>
            <span className="MTL-startTime"> {time?.slice(0, -6)} {time?.slice(-2)}</span>
            <div className="bar" />
          </>
        );
      })}
    </div>
  );
  const getCircleComponents = (tasks: GoalItem[]) => (
    <div id="MTL-circles">
      {tasks.map((task: GoalItem) => (
        <>
          <span className="MTL-circle" style={{ backgroundColor: `${task.goalColor}` }} />
          <div className="vbar" />
        </>

      ))}
    </div>
  );
  const getTitleComponents = (tasks: GoalItem[]) => (
    <div id="MTL-titles">
      {tasks.map((task: GoalItem, index: number) => (
        <>
          <button
            type="button"
            className="MTL-taskTtitle"
            onClick={() => setDisplayOptionsIndex(index)}
          >
            {task.title}
          </button>
          <div className="bar" />
        </>
      ))}
    </div>
  );
  const showOptions = (task: GoalItem, index: number) => (
    <div className="MTL-options_container">
      <div className="MTL-options-task">
        <div className="MTL-circle" style={{ backgroundColor: "transparent" }} />
        <div className="MTL-options-title">{task.title}</div>
      </div>
      <div className="MTL-options">
        <button type="button"> Forgot</button>
        <button type="button"> Reschedule</button>
        <button type="button"> Done</button>
      </div>
    </div>
  );
  const renderTimeline = (start: number, end: number = myTasks.length) => (
    <>
      <div>{getTimeComponents(myTasks.slice(start, end))}</div>
      <div>{getCircleComponents(myTasks.slice(start, end))}</div>
      <div style={{ paddingLeft: "1vh" }}>{getTitleComponents(myTasks.slice(start, end))}</div>
    </>
  );
  return (
    <div id={`MTL-display${displayOptionsIndex !== -1 ? "-withOption" : ""}`}>
      {displayOptionsIndex !== -1 ? (
        <>
          <div style={{ display: "flex" }}>{renderTimeline(0, displayOptionsIndex)}</div>
          {showOptions(myTasks[displayOptionsIndex], displayOptionsIndex)}
          <div style={{ display: "flex" }}>{renderTimeline(displayOptionsIndex + 1)}</div>
        </>
      ) : renderTimeline(0, myTasks.length)}
    </div>
  );
};
