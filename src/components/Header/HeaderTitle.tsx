import { useTranslation } from "react-i18next";
import React from "react";
import { PageTitle } from "@src/constants/pageTitle";
import "./HeaderTitle.scss";
import { calculateGoalDepth } from "@src/helpers/GoalProcessor";

interface HeaderTitleProps {
  title: PageTitle;
}

const HeaderTitle = ({ title }: HeaderTitleProps) => {
  const { t } = useTranslation();
  const goalsRoute = window.location.pathname.startsWith("/goals");
  const handleTitleClick = React.useCallback(async () => {
    if (goalsRoute) {
      const currentParentId = window.location.pathname.split("/")[2];
      if (currentParentId === "root") {
        return;
      }
      const depth = await calculateGoalDepth(currentParentId);
      if (depth > 0) {
        window.history.go(-depth);
      }
    }
  }, [goalsRoute]);
  return (
    <h1 className="header-title" onClickCapture={handleTitleClick}>
      {t(title)}
    </h1>
  );
};

export default React.memo(HeaderTitle);
