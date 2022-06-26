/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { addGoal, createGoal, getActiveGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

import "./MyTimePage.scss";
import { getDiffInHours } from "@src/utils";

export const MyTimePage = () => {
  const [tmpTasks, setTmpTasks] = useState<GoalItem[]>([]);
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);
  const [unplannedIndices, setUnplannedIndices] = useState<number[]>([]);
  const [unplannedDurations, setUnplannedDurations] = useState<number[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [toggle, setToggle] = useState(false);

  const today = new Date();
  today.setDate(today.getDate() + 1);

  const darkrooms = ["#443027", "#9C4663", "#2B517B", "#612854"];

  const getColorWidth = (unplanned: boolean, duration: number) => {
    if (toggle) return (duration * 4.17);
    let colorWidth = 0;
    if (unplanned && duration > goalOfMaxDuration) {
      colorWidth = (goalOfMaxDuration + 1) * 4.17;
    } else {
      colorWidth = (duration * 4.17) + (maxDurationOfUnplanned - 1 - goalOfMaxDuration) * 4.17;
    }
    return colorWidth;
  };

  const getColorComponent = (id: number|undefined|string, colorWidth:number, color: string) => (
    <div
      key={`task-${id}`}
      style={{
        width: `${colorWidth}%`, // "10%",
        height: "10px",
        backgroundColor: `${color}`
      }}
    />
  );
  const displayTasks = () => (
    <div>
      {tmpTasks.map((task) => (
        <h3>
          {`${task.title} ${task.start?.toLocaleTimeString()} - ${task.finish?.toLocaleTimeString()}`}
        </h3>
      ))}
    </div>
  );
  const getDayComponent = (day: string) => {
    let colorIndex = -1;
    return (
      <div key={`day-${day}`} className="MyTime_day">
        <div className="MyTime_navRow">
          <h3 className="MyTime_dayTitle"> {day} </h3>
          <button
            className="MyTime-expand-btw"
            type="button"
            onClick={() => {
              setShowTasks(!showTasks);
            }}
          >
            <div> <ChevronRight /> </div>
          </button>
        </div>
        <div className="MyTime_colorPalette">
          {tmpTasks.map((task, index) => {
            const colorWidth = getColorWidth(false, task.duration);
            colorIndex = (colorIndex === darkrooms.length - 1) ? 0 : colorIndex + 1;
            if (unplannedIndices.includes(index)) {
              const unpColorWidth = getColorWidth(true, unplannedDurations[index]);
              return index === 0 ? (
                <>
                  {getColorComponent(`U-${day}-${index}`, unpColorWidth, "lightgray")}
                  {getColorComponent(`task-${day}-${task.id}`, colorWidth, darkrooms[colorIndex])}
                </>
              )
                : (
                  <>
                    {getColorComponent(`task-${day}-${task.id}`, colorWidth, darkrooms[colorIndex])}
                    {getColorComponent(`U-${day}-${index}`, unpColorWidth, "lightgray")}
                  </>
                );
            }
            return (getColorComponent(`task-${day}-${task.id}`, colorWidth, darkrooms[colorIndex]));
          })}
          {unplannedIndices.slice(-1)[0] + 1 === tmpTasks.length ?
            getColorComponent(`U-${day}-${-1}`, getColorWidth(true, unplannedDurations.slice(-1)[0]), "lightgray")
            : null}
        </div>
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      // const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
      const createDummyGoals = async () => {
        let start = 0;
        let end = 0;

        const dummyNames: string[] = ["Unplanned", "Gym", "Study", "Unplanned", "Shopping", "Code Reviews", "Unplanned", "Algo Practice"];
        // const dummyNames: string[] = ["Gym", "Study", "Shopping", "Code Reviews", "Algo Practice"];
        const dummyDurations : number[] = [4, 3, 1, 2, 3, 2, 6, 3];
        dummyNames.map(async (goalName, index) => {
          end = start + dummyDurations[index];
          if (goalName === "Unplanned") {
            start = end;
            return null;
          }
          console.log("added");
          const dummyGoal = createGoal(
            goalName,
            true,
            dummyDurations[index],
            new Date(new Date().setHours(start, 0, 0)),
            new Date(new Date().setHours(end, 0, 0)),
            0,
            -1
          );
          start = end;
          const id = await addGoal(dummyGoal);
          return id;
        });
      };
      const getTasks = async () => {
        const goals: GoalItem[] = await getActiveGoals();
        let GMD = goals[0].duration;
        let MDU = goals[0].duration;
        let prev = new Date(goals[0].finish ? goals[0].finish : new Date());
        prev = new Date(prev.setHours(0));
        const unplannedInd :number[] = [];
        const unplannedDur :number[] = [];
        goals.map((goal, index) => {
          console.log(prev, goal.start);
          const diff = getDiffInHours(goal.start ? goal.start : new Date(), prev);
          console.log(index, diff);
          prev = new Date(goal.finish ? goal.finish : new Date());
          if (diff > 0) {
            unplannedInd.push(index);
            unplannedDur.push(diff);
            MDU = MDU < diff ? diff : MDU;
          }
          if (GMD < goal.duration) GMD = goal.duration;
          return null;
        });
        setUnplannedDurations([...unplannedDur]);
        setUnplannedIndices([...unplannedInd]);
        setGoalOfMaxDuration(GMD);
        setMaxDurationOfUnplanned(MDU);
        console.log(unplannedInd);
        return goals;
      };
      let tasks: GoalItem[] = await getActiveGoals();
      if (tasks.length === 0) {
        await createDummyGoals();
      }
      tasks = await getTasks();

      setTmpTasks([...tasks]);
    })();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <div className="slide MyTime_container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 id="MyTime_title">My Time</h1>
          <button style={{ fontSize: "1.52rem", background: "transparent" }} type="button" onClick={() => setToggle(!toggle)}>Normalize</button>
        </div>
        <div id="MyTime_days_container">
          {getDayComponent("Today")}
          {
          showTasks ? displayTasks() : null
          }
          {getDayComponent("Tomorrow")}
          {
            [...Array(5).keys()].map(() => {
              today.setDate(today.getDate() + 1);
              return getDayComponent(`${today.toDateString()}`);
            })
          }
        </div>
      </div>
    </div>
  );
};
