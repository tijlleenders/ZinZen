import React, { useEffect } from "react";

import { Container, Row } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { createDummyGoals } from "@src/utils";
import { getActiveGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

import "./MyTimePage.scss";

export const MyTimePage = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);

  const darkrooms = ["#443027", "#9C4663", "#646464", "#2B517B", " #612854"];

  const getDayComponent = (day: string) => (
    <div className="MyTime_day">
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
        {[...Array(10).keys()].map((i) => (
          <div
            key={`task-${i}`}
            style={{
              width: "10%",
              height: "10px",
              backgroundColor: `${darkrooms[Math.floor(Math.random() * darkrooms.length)]}`
            }}
          />
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    (async () => {
      const goals: GoalItem[] = await getActiveGoals();
      if (goals.length === 0) { await createDummyGoals(); }
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
