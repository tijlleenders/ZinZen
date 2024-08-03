import React from "react";
import { replaceUrlsWithText } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { useRecoilValue } from "recoil";
import { justCompletedGoalsState } from "@src/store/GoalsState";
import { useTelHandler, useUrlHandler } from "../GoalTitleHandlers";

interface GoalTitleProps {
  goal: GoalItem;
  isImpossible: boolean;
}

const GoalTitle = ({ goal, isImpossible }: GoalTitleProps) => {
  const { t } = useTranslation();
  const { id, title } = goal;
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));

  const justCompletedGoals = useRecoilValue(justCompletedGoalsState);
  const isCompleted = justCompletedGoals.includes(goal.id);

  const textParts = replacedString.split(/(zURL-\d+)/g);

  return (
    <div className={`goal-title ${isCompleted ? " completed" : ""}`}>
      {isImpossible && "! "}
      {textParts.map((part) => {
        const match = part.match(/zURL-(\d+)/);
        if (match) {
          const urlIndex = parseInt(match[1], 10);
          const url = urlsWithIndexes[urlIndex];
          if (url.startsWith("tel:")) {
            const TelHandlerComponent = useTelHandler(url);
            return <TelHandlerComponent key={`${id}-tel-${urlIndex}`} />;
          }
          const UrlHandlerComponent = useUrlHandler(url);
          return <UrlHandlerComponent key={`${id}-url-${urlIndex}`} />;
        }
        return <span key={`${id}-text-${part}`}>{part}</span>;
      })}
    </div>
  );
};

export default GoalTitle;
