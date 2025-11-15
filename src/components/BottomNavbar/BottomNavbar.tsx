/* eslint-disable complexity */
import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";

import { themeSelectionMode } from "@src/store/ThemeState";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import GlobalAddBtn from "@components/GlobalAddBtn";

import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";
import "./BottomNavbar.scss";
import Icon from "@src/common/Icon";
import { PageTitle } from "@src/constants/pageTitle";
import { moveGoalState } from "@src/store/moveGoalState";
import ThemeSelectionControls from "./ThemeSelectionControls";

const BottomNavbar = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goalToMove = useRecoilValue(moveGoalState);
  const { partnerId, parentId } = useParams({ strict: false }) as { partnerId?: string; parentId: string };
  const { data: goal } = useGetGoalById(parentId);
  const isPartnerModeActive = !!partnerId;
  const themeSelection = useRecoilValue(themeSelectionMode);
  const activeGoalId = useRouterState({
    select: (state) => state.location.state.activeGoalId,
  });
  const from = useRouterState({
    select: (state) => state.location.state.from,
  });

  const currentPage = window.location.pathname.split("/")[1];

  const handleClick = (to: string) => {
    if (from === to) {
      window.history.back();
      return;
    }

    if (to === "MyTime") {
      if (currentPage !== "") {
        navigate({
          to: "/",
          state: (prevState) => ({
            ...prevState,
            from: currentPage,
            displayFocus: false,
          }),
        });
      }
      return;
    }

    if (to === "goals") {
      if (currentPage !== "goals") {
        navigate({
          to: "/goals/$parentId",
          params: { parentId: "root" },
          state: (prevState) => ({
            ...prevState,
            from: currentPage,
            displayFocus: false,
          }),
        });
      } else if (goal) {
        window.history.go(-goal.depth);
      }
      return;
    }

    if (currentPage !== "MyJournal") {
      navigate({
        to: "/MyJournal",
        state: (prevState) => ({
          ...prevState,
          from: currentPage,
          displayFocus: false,
        }),
      });
    }
  };

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
