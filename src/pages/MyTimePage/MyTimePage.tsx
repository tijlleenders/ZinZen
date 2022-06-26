import React, { useEffect, useState } from "react";

import { Container, Row } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { addGoal, createGoal, getActiveGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

import "./MyTimePage.scss";

export const MyTimePage = () => {
  const [tmpTasks, setTmpTasks] = useState<GoalItem[]>([]);
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
            console.log(task);
            colorIndex = (colorIndex === darkrooms.length - 1) ? 0 : colorIndex + 1;
            return (
              <div
                key={`task-${task.id}`}
                style={{
                  width: `${task.duration * 4.15}%`, // "10%",
                  height: "10px",
                  backgroundColor: `${darkrooms[colorIndex]}`
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
      const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
      const createDummyGoals = async () => {
        console.log("wait");
        const dummyNames: string[] = ["Walk", "Gym", "Study", "Shopping", "Nap", "Code Reviews", "Algo Practice"];
        dummyNames.map(async (goalName: string) => {
          const dummyGoal = createGoal(
            goalName,
            true,
            random(1, 4),
            null,
            null,
            0,
            -1
          );
          const id = await addGoal(dummyGoal);
          return id;
        });
      };
      let goals: GoalItem[] = await getActiveGoals();
      if (goals.length === 0) {
        await createDummyGoals();
        goals = await getActiveGoals();
      }
      setTmpTasks([...goals]);
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
