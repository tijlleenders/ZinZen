import { ITaskProgress } from "@src/Interfaces/IPages";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { TaskItem } from "@src/models/TaskItem";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface IColorBands {
  tasksStatus: {
    [goalId: string]: TaskItem;
  };
  active: boolean;
  list: ITaskOfDay;
  day: string;
}

const ColorBands: React.FC<IColorBands> = ({ list, tasksStatus, day, active }) => {
  const taskProgress: ITaskProgress = {};
  const completion: { [goalId: string]: number } = {};
  list.scheduled.forEach((ele) => {
    const { goalid } = ele;
    if (!taskProgress[goalid]) {
      const completedToday = tasksStatus[goalid]?.completedToday || 0;
      completion[goalid] = completedToday + (completion[goalid] || 0);
      taskProgress[goalid] = { total: 0, completed: completedToday, goalColor: ele.goalColor };
    }
    taskProgress[goalid].total += ele.duration;
  });

  const completed: React.CSSProperties[] = [];
  let acc = 0;
  [...(list.colorBands || [])].forEach((ele) => {
    const customStyle = { ...ele.style };
    if (completion[ele.goalId]) {
      acc += ele.duration;
      completion[ele.goalId] -= ele.duration;
      completed.push({ ...customStyle, width: `${(acc / 24) * 100}%` });
    }
  });
  return (
    <>
      <div className={`MyTime_colorPalette ${active ? "active" : ""}`}>
        {(list.colorBands || []).map((ele, index) => (
          <div className="colorBand" key={uuidv4()} style={{ zIndex: 30 - index, height: 10, ...ele.style }} />
        ))}
      </div>
      {active && day === "Today" && (
        <div className={`MyTime_colorPalette ${active ? "active" : ""}`}>
          {[
            ...completed,
            {
              width: "100%",
              background: "#d9cccc",
            },
          ].map((ele, index) => (
            <div className="colorBand" key={uuidv4()} style={{ zIndex: 30 - index, height: 10, ...ele }} />
          ))}
        </div>
      )}
    </>
  );
};

export default ColorBands;
