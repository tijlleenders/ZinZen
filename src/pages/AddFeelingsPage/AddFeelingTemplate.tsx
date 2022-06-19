// @ts-nocheck
import React from "react";
import { Button, Navbar, Container } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";

import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { addFeeling } from "@api/FeelingsAPI";
import { darkModeState } from "@store";
import { feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";
import "./AddFeelingsPage.scss";

export const FeelingTemplate = ({
  feelingCategory,
  feelingsList,
  feelingDate,
}: {
  feelingCategory: string;
  feelingsList: string[];
  feelingDate: Date;
}) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const navigate = useNavigate();

  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
            {t(feelingCategory)}
            {feelingsEmojis[feelingCategory]}
          </Button>
          <br />
          {feelingsList.map((feelingName) => (
            <Button
              key={feelingName}
              className={
                darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"
              }
              size="lg"
              onClick={() => {
                console.log(feelingDate);
                addFeeling(feelingName, feelingCategory, feelingDate);
                setTimeout(() => {
                  navigate("/Home/MyFeelings");
                }, 100);
              }}
            >
              {t(feelingName)}
            </Button>
          ))}
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <div className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
              <div className="feelings-name">
                {t(feelingCategory)}
                {feelingsEmojis[feelingCategory]}
              </div>
              <div className="feelings-expand-btw">
                <div><ChevronRight /></div>
              </div>
            </div>
          </Navbar>
        </div>
      </Container>
    </div>
  );
};
