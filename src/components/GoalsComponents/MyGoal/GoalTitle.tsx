import React from "react";
import { replaceUrlsWithText } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { TelHandler, UrlHandler } from "./GoalTitleProcessors";

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
        const match = part.match(/zURL-(\d+)/);
        if (match) {
          const urlIndex = parseInt(match[1], 10);
          const url = urlsWithIndexes[urlIndex];
          if (url.startsWith("tel:")) {
            return <TelHandler key={`${id}-tel-${urlIndex}`} telUrl={url} />;
          }
          return <UrlHandler key={`${id}-url-${urlIndex}`} url={url} />;
        }
        return <span key={`${id}-text-${part}`}>{part}</span>;
      })}
    </div>
  );
};

export default GoalTitle;
