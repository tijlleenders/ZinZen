import React from "react";
import { removeBackTicks, replaceUrlsWithText, isGoalCode, summarizeUrl } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import useGoalActions from "@src/hooks/useGoalActions";
import { useTelHandler, useUrlHandler } from "../GoalTitleHandlers";

interface GoalTitleProps {
  goal: GoalItem;
  isImpossible: boolean;
}

const GoalTitle = ({ goal, isImpossible }: GoalTitleProps) => {
  const { t } = useTranslation();
  const { copyCode } = useGoalActions();
  const { id, title } = goal;
  const isCodeSnippet = isGoalCode(title);
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));
  const textParts = replacedString.split(/(zURL-\d+)/g);

  const handleClick = () => {
    if (isCodeSnippet) {
      copyCode(title);
    }
  };

  return (
    <div aria-hidden className="goal-title" onClick={isCodeSnippet ? handleClick : undefined}>
      {isImpossible && "! "}
      {textParts.map((part) => {
        const cleanPart = removeBackTicks(part);
        const match = cleanPart.match(/zURL-(\d+)/);
        if (match) {
          const urlIndex = parseInt(match[1], 10);
          const url = urlsWithIndexes[urlIndex];
          const TelHandlerComponent = useTelHandler(url);
          const UrlHandlerComponent = useUrlHandler(url);
          const displayText = summarizeUrl(url);
          if (url.startsWith("tel:")) {
            return <TelHandlerComponent key={`${id}-tel-${urlIndex}`} />;
          }
          if (isCodeSnippet) {
            return <span key={`${id}-url-${urlIndex}`}>{displayText}</span>;
          }
          return <UrlHandlerComponent key={`${id}-url-${urlIndex}`} />;
        }
        return <span key={`${id}-text-${part}`}>{part}</span>;
      })}
    </div>
  );
};

export default React.memo(GoalTitle);
