// @ts-nocheck
import React from "react";
import { Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { darkModeState } from "@store";
import { truncateContent } from "@utils";

import "@translations/i18n";
import "./DashboardUserChoicePanel.scss";

import "@pages/Dashboard/Dashboard.scss";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div>
      <MainHeaderDashboard />
      <div id="dashboard-container">
        <div className="slide">
          <div>
            <Button
              variant={darkModeStatus ? "bdivn" : "peach"}
              size="lg"
              className={`no-add ${darkModeStatus ? "dashboard-choice-dark1" : "dashboard-choice-light1"}`}
              onClick={() => {
                navigate("/Home/MyGoals");
              }}
            >
              {truncateContent(t("mygoals"))}
            </Button>
          </div>
          <div>
            <Button
              variant={darkModeStatus ? "dark-pink" : "pink"}
              size="lg"
              className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
              onClick={() => {
                navigate("/Home/MyFeelings");
              }}
            >
              {truncateContent(t("myfeelings"))}
            </Button>
          </div>
          <div>
            <Button
              variant={darkModeStatus ? "dark-grey" : "grey-base"}
              size="lg"
              onClick={() => {
                navigate("/Home/MyTime");
              }}
              className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
            >
              {truncateContent(t("mytime"))}
            </Button>
          </div>
          <div>
            <Button
              variant={darkModeStatus ? "dark-blue" : "pale-blue"}
              size="lg"
              className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
              onClick={() => {
                navigate("/Home/Explore");
              }}
            >
              {truncateContent(t("explore"))}
            </Button>
          </div>
          <div>
            <Button
              variant={darkModeStatus ? "dark-purple" : "purple"}
              size="lg"
              className={darkModeStatus ? "dashboard-choice-dark no-add" : "dashboard-choice-light no-add"}
              onClick={() => {
                navigate("/Home/ZinZen");
              }}
            >
              <div style={{ display: "flex" }}>
                <div>
                  ZinZen
                </div>
                <div style={{ fontSize: "small" }}>
                  ®
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
