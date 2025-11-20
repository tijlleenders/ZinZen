import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { themeSelectionMode } from "@src/store/ThemeState";
import BottomNavLayout from "@src/layouts/BottomNavLayout";

import "./BottomNavbar.scss";
import Icon from "@src/common/Icon";
import { BottomNavButton } from "./BottomNavButton";
import ThemeSelectionControls from "./ThemeSelectionControls";

export interface BottomNavbarProps {
  onScheduleClick?: () => void;
  onGoalsClick?: () => void;
  onJournalClick?: () => void;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ onScheduleClick, onGoalsClick, onJournalClick }) => {
  const { t } = useTranslation();
  const themeSelection = useRecoilValue(themeSelectionMode);

  const currentPage = window.location.pathname.split("/")[1];

  if (themeSelection) {
    return <ThemeSelectionControls onClose={window.history.back} />;
  }

  return (
    <BottomNavLayout>
      <BottomNavButton
        active={currentPage === ""}
        onClick={() => {
          onScheduleClick?.();
        }}
      >
        <Icon active={currentPage === ""} title="CalendarIcon" />
        <p>{t("Schedule")}</p>
      </BottomNavButton>
      <BottomNavButton
        active={currentPage === "goals"}
        onClick={() => onGoalsClick?.()}
        testId="navigation-button-Goals"
      >
        <Icon active={currentPage === "goals"} title="GoalsIcon" />
        <p>{t("Goals")}</p>
      </BottomNavButton>

      <BottomNavButton
        active={currentPage === "MyJournal"}
        onClick={(e) => {
          e.stopPropagation();
          onJournalClick?.();
        }}
      >
        <Icon active={currentPage === "MyJournal"} title="JournalIcon" />
        <p>{t("Journal")}</p>
      </BottomNavButton>
    </BottomNavLayout>
  );
};

export default BottomNavbar;
