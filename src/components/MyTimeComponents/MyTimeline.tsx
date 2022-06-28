/* eslint-disable react/jsx-key */
import React from "react";

import { GoalItem } from "@src/models/GoalItem";

import "./MyTimeline.scss";

export const MyTimeline = ({ myTasks }: {myTasks: GoalItem[]}) => {
  const getTimeComponents = () => (
    <div id="MTL-times">
      {myTasks.map((task: GoalItem) => {
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
  const getCircleComponents = () => (
    <div id="MTL-circles">
      {myTasks.map((task: GoalItem) => (
        <>
          <span className="MTL-circle" style={{backgroundColor: `${task.goalColor}`}}/>
          <div className="vbar" />
        </>

      ))}
    </div>
  );
  const getTitleComponents = () => (
    <div id="MTL-titles">
      {myTasks.map((task: GoalItem) => (
        <>
          <span className="MTL-taskTtitle">{task.title}</span>
          <div className="bar" />
        </>
      ))}
    </div>
  );
  return (
    <div id="MTL-display">
      <div>{getTimeComponents()}</div>
      <div>{getCircleComponents()}</div>
      <div style={{ paddingLeft: "1vh" }}>{getTitleComponents()}</div>
    </div>
  );
};
