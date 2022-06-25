import React from "react";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { Container, Row } from "react-bootstrap";

import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@src/store";

import "./MyTimePage.scss";

export const MyTimePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const today = new Date();
  today.setDate(today.getDate() + 1);

  const darkrooms = ["#443027", "#9C4663", "#646464", "#2B517B", " #612854"];

  const getDayComponent = (day: string) => (
    <div className="MyTime_day">
      <h3 className="MyTime_dayTitle">{day}</h3>
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
