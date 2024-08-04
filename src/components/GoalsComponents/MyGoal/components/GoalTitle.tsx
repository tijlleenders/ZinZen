import React, { useRef } from "react";
import { replaceUrlsWithText } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import { useTelHandler, useUrlHandler } from "../GoalTitleHandlers";

interface GoalTitleProps {
  goal: GoalItem;
  isImpossible: boolean;
  isCompleted: boolean;
}

const GoalTitle = ({ goal, isImpossible, isCompleted }: GoalTitleProps) => {
  const { t } = useTranslation();
  const { id, title } = goal;
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));
  const textParts = replacedString.split(/(zURL-\d+)/g);
  const titleRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(document.querySelector(".archived-drawer"));

  if (titleRef.current && !doneRef.current?.contains(titleRef.current)) {
    if (isCompleted) {
      titleRef.current.style.textDecoration = "line-through";
      titleRef.current.style.textDecorationColor = goal.goalColor;
      titleRef.current.style.textDecorationThickness = "2px";
    } else {
      titleRef.current.style.textDecoration = "none";
    }
  }

  return (
    <div ref={titleRef} className="goal-title">
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
