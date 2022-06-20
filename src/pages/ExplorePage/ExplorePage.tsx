// @ts-nocheck
import React from "react";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import Health from "@assets/images/health-fitness-goals.jpg";
import Career from "@assets/images/career-goals.jpg";
import MindAndSpirit from "@assets/images/mind-spirit-goals.jpg";
import Nature from "@assets/images/nature-environment-goals.jpeg";
import PersonalGrowth from "@assets/images/personalGrowth-goals.jpg";
import Relationship from "@assets/images/relationship-goals.jpg";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import "@translations/i18n";
import "./explorepage.scss";
import { darkModeState } from "@src/store";

export const ExplorePage = () => {
  const goals: any = [
    { goalName: "healthGoals", goalImage: Health },
    { goalName: "relationshipGoals", goalImage: Relationship },
    { goalName: "spiritualGoals", goalImage: MindAndSpirit },
    { goalName: "careerGoals", goalImage: Career },
    { goalName: "environmentGoals", goalImage: Nature },
    { goalName: "personalGrowthGoals", goalImage: PersonalGrowth },
  ];
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <div id={`explore-container-${darkModeStatus ? "dark" : "light"}`}>
        <Container fluid className="slide">
          <div id="explore-goals-container">
            {goals.map((goal: any) => (
              <div className="explore-goal-row">
                <div className="explore-goal-card">
                  <img className="explore-goal-img" alt="my-goals" src={goal.goalImage} />
                  <div className="explore-goal-title">{t(goal.goalName)}</div>
                  <h1 className="explore-addGoal-btn">+</h1>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};
