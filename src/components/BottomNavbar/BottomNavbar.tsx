import React from "react";
import { useTranslation } from "react-i18next";
import BottomNavLayout from "@src/layouts/BottomNavLayout";
import { useBottomNavbarNavigation } from "@src/hooks/useBottomNavbarNavigation";
import Icon from "@src/common/Icon";
import { BottomNavButton } from "./BottomNavButton";

export const BottomNavbar = () => {
  const { t } = useTranslation();
  const { onScheduleClick, onGoalsClick, onJournalClick } = useBottomNavbarNavigation();

  const currentPage = window.location.pathname.split("/")[1];

  const isScheduleActive = currentPage === "";
  const isGoalsActive = currentPage === "goals";
  const isJournalActive = currentPage === "MyJournal";

  return (
    <BottomNavLayout>
      <BottomNavButton
        active={isScheduleActive}
        onClick={() => {
          onScheduleClick?.();
        }}
      >
        <Icon active={isScheduleActive} title="CalendarIcon" />
        <p>{t("Schedule")}</p>
      </BottomNavButton>
      <BottomNavButton active={isGoalsActive} onClick={() => onGoalsClick?.()} testId="navigation-button-Goals">
        <Icon active={isGoalsActive} title="GoalsIcon" />
        <p>{t("Goals")}</p>
      </BottomNavButton>

      <BottomNavButton
        active={isJournalActive}
        onClick={() => {
          onJournalClick?.();
        }}
      >
        <Icon active={isJournalActive} title="JournalIcon" />
        <p>{t("Journal")}</p>
      </BottomNavButton>
    </BottomNavLayout>
  );
};
