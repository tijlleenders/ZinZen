/* eslint-disable complexity */
import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useLocation, useNavigate, useParams } from "@tanstack/react-router";

import { themeSelectionMode } from "@src/store/ThemeState";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import GlobalAddBtn from "@components/GlobalAddBtn";

import "./BottomNavbar.scss";
import Icon from "@src/common/Icon";
import { PageTitle } from "@src/constants/pageTitle";
import { moveGoalState } from "@src/store/moveGoalState";
import ThemeSelectionControls from "./ThemeSelectionControls";

const BottomNavbar = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const goalToMove = useRecoilValue(moveGoalState);
  const { partnerId } = useParams({ strict: false }) as { partnerId?: string };
  const isPartnerModeActive = !!partnerId;

  const themeSelection = useRecoilValue(themeSelectionMode);

  const currentPage = window.location.pathname.split("/")[1];
  const subGoalHistory = location.state?.goalsHistory ?? [];

  const handleClick = (to: string) => {
    if (location.state?.from === to) {
      window.history.back();
    } else {
      const newLocationState = { ...location.state, from: currentPage, displayFocus: false };
      if (to === "MyTime") {
        if (currentPage !== "") navigate({ to: "/", state: newLocationState });
      } else if (to === "goals") {
        if (currentPage !== "goals") {
          navigate({
            to: "/goals/$parentId",
            params: { parentId: "root" },
            state: newLocationState,
          });
        } else if (subGoalHistory.length > 0) {
          window.history.go(-subGoalHistory.length);
        }
      } else if (currentPage !== "MyJournal") {
        navigate({ to: "/MyJournal", state: newLocationState });
      }
    }
  };

  const { activeGoalId } = location.state || {};

  const isAddBtnVisible =
    title !== "Focus" &&
    title !== PageTitle.Contacts &&
    (isPartnerModeActive ? !!activeGoalId || Boolean(goalToMove) : true);

  if (themeSelection) {
    return (
      <ThemeSelectionControls
        isAddBtnVisible={isAddBtnVisible}
        onClose={() => {
          window.history.back();
        }}
        title={title}
      />
    );
  }

  return (
    <BottomNavLayout>
      <button
        type="button"
        onClick={() => {
          handleClick("MyTime");
        }}
        className={`bottom-nav-item ${currentPage === "" ? "active" : ""}`}
      >
        <div
          style={{
            transform: "none",
          }}
        >
          <Icon active={currentPage === ""} title="CalendarIcon" />
        </div>
        <p>{t("Schedule")}</p>
      </button>
      <button
        type="button"
        onClick={() => {
          handleClick("goals");
        }}
        data-testid="navigation-button-Goals"
        className={`bottom-nav-item ${currentPage === "goals" ? "active" : ""}`}
      >
        <Icon active={currentPage === "goals"} title="GoalsIcon" />
        <p>{t("Goals")}</p>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClick("MyJournal");
        }}
        style={{
          padding: 7.5,
          gap: 10,
        }}
        className={`bottom-nav-item ${currentPage === "MyJournal" ? "active" : ""}`}
      >
        <Icon active={currentPage === "MyJournal"} title="JournalIcon" />
        <p>{t("Journal")}</p>
        {isAddBtnVisible && <GlobalAddBtn add={title} />}
      </button>
    </BottomNavLayout>
  );
};

export default BottomNavbar;
