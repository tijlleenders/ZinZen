import React, { useEffect, useState } from "react";

import { Container, Row } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { addGoal, createGoal, getActiveGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

import "./MyTimePage.scss";

export const MyTimePage = () => {
  const [tmpTasks, setTmpTasks] = useState<GoalItem[]>([]);
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);
  const today = new Date();
  today.setDate(today.getDate() + 1);

  const darkrooms = ["#443027", "#9C4663", "#2B517B", "#612854"];

  const getDayComponent = (day: string) => {
    let colorIndex = -1;
    return (
      <div key={`day-${day}`} className="MyTime_day">
        <div className="MyTime_navRow">
          <h3 className="MyTime_dayTitle">
            {day}
          </h3>
          <button
            className="MyTime-expand-btw"
            type="button"
          >
            <div>
              <ChevronRight />
            </div>
          </button>
        </div>
        <div className="MyTime_colorPalette">
          {tmpTasks.map((task) => {
            let colorWidth = 0;
            colorIndex = (colorIndex === darkrooms.length - 1) ? 0 : colorIndex + 1;
            if (task.title === "Unplaned" && task.duration > goalOfMaxDuration) {
              colorWidth = (goalOfMaxDuration + 1) * 4.17;
            } else {
              colorWidth = (task.duration * 4.17) + (maxDurationOfUnplanned - 1 - goalOfMaxDuration) * 4.17;
            }
            return (
              <div
                key={`task-${task.id}`}
                style={{
                  width: `${colorWidth}%`, // "10%",
                  height: "10px",
                  backgroundColor: `${task.title === "Unplaned" ? "gray" : darkrooms[colorIndex]}`
                }}
              />
            );
          }
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      // const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
      const createDummyGoals = async () => {
        const dummyNames: string[] = ["Unplaned", "Gym", "Study", "Unplaned", "Shopping", "Code Reviews", "Unplaned", "Algo Practice"];
        const dummyDurations : number[] = [4, 3, 1, 2, 3, 2, 6, 3];
        dummyNames.map(async (goalName, index) => {
          const dummyGoal = createGoal(
            goalName,
            true,
            dummyDurations[index],
            null,
            null,
            0,
            -1
          );
          const id = await addGoal(dummyGoal);
          return id;
        });
      };
      const getTasks = async () => {
        const goals: GoalItem[] = await getActiveGoals();
        let GMD = 0;
        let MDU = 0;
        goals.map((goal) => {
          if (goal.title === "Unplaned" && MDU < goal.duration) {
            MDU = goal.duration;
          } else if (GMD < goal.duration) GMD = goal.duration;
          return null;
        });
        setGoalOfMaxDuration(GMD);
        setMaxDurationOfUnplanned(MDU);
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
        <h1 id="MyTime_title">My Time</h1>
        <div id="MyTime_days_container">
          {getDayComponent("Today")}
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
