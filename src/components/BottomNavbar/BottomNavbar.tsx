import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useMatchRoute } from "@tanstack/react-router";

import { themeSelectionMode } from "@src/store/ThemeState";
import { useBottomNavbarNavigation } from "@src/hooks/useBottomNavbarNavigation";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import "./BottomNavbar.scss";
import Icon from "@src/common/Icon";
import { BottomNavButton } from "./BottomNavButton";
import ThemeSelectionControls from "./ThemeSelectionControls";

const BottomNavbar: React.FC = () => {
  const { t } = useTranslation();
  const themeSelection = useRecoilValue(themeSelectionMode);
  const matchRoute = useMatchRoute();
  const { onScheduleClick, onGoalsClick, onJournalClick } = useBottomNavbarNavigation();

  const isScheduleActive = !!matchRoute({ to: "/", fuzzy: false });
  const isGoalsActive = !!matchRoute({ to: "/goals/$parentId", fuzzy: true });
  const isJournalActive = !!matchRoute({ to: "/MyJournal", fuzzy: false });

  if (themeSelection) {
    return <ThemeSelectionControls onClose={() => window.history.back()} />;
  }

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
        onClick={(e) => {
          e.stopPropagation();
          onJournalClick?.();
        }}
      >
        <Icon active={isJournalActive} title="JournalIcon" />
        <p>{t("Journal")}</p>
      </BottomNavButton>
    </BottomNavLayout>
  );
};

export default BottomNavbar;
