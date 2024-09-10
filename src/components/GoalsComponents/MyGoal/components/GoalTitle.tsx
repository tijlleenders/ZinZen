import React from "react";
import { removeBackTicks, replaceUrlsWithText } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { useTelHandler, useUrlHandler } from "../GoalTitleHandlers";

interface GoalTitleProps {
  goal: GoalItem;
  isImpossible: boolean;
}

const GoalTitle = ({ goal, isImpossible }: GoalTitleProps) => {
  const { t } = useTranslation();
  const { id, title } = goal;
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));
  const textParts = replacedString.split(/(zURL-\d+)/g);

  return (
    <div className="goal-title">
      {isImpossible && "! "}
      {textParts.map((part) => {
        part = removeBackTicks(part); // if it contains backticks, strip it
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

export default React.memo(GoalTitle);
