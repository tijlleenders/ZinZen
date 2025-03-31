import React from "react";
import { removeBackTicks, replaceUrlsWithText, isGoalCode, summarizeUrl } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";
import useGoalActions from "@src/hooks/useGoalActions";
import { useTelHandler, useUrlHandler } from "../GoalTitleHandlers";

interface GoalTitleProps {
  goal: GoalItem;
  isImpossible: boolean;
  onTitleClick?: (e: React.MouseEvent) => void;
}

const UrlComponent = ({
  url,
  goalId,
  urlIndex,
  isCodeSnippet,
  copyCode,
  title,
}: {
  url: string;
  goalId: string;
  urlIndex: number;
  isCodeSnippet: boolean;
  copyCode: (code: string) => void;
  title: string;
}) => {
  const TelHandlerComponent = useTelHandler(url);
  const UrlHandlerComponent = useUrlHandler(url);
  const displayText = summarizeUrl(url);

  if (url.startsWith("tel:")) {
    return <TelHandlerComponent key={`${goalId}-tel-${urlIndex}`} />;
  }
  if (isCodeSnippet) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          copyCode(title);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            copyCode(title);
          }
        }}
        key={`${goalId}-url-${urlIndex}`}
      >
        {displayText}
      </span>
    );
  }
  return <UrlHandlerComponent key={`${goalId}-url-${urlIndex}`} />;
};

const GoalTitle = ({ goal, isImpossible, onTitleClick }: GoalTitleProps) => {
  const { t } = useTranslation();
  const { copyCode } = useGoalActions();
  const { id, title } = goal;

  const isCodeSnippet = isGoalCode(title);
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));
  const textParts = replacedString.split(/(zURL-\d+)/g);

  const handleClick = (e: React.MouseEvent) => {
    // Only handle clicks if we're not clicking on a link or code snippet
    if (!(e.target as HTMLElement).closest("button") && !isCodeSnippet) {
      onTitleClick?.(e);
    }
  };

  const renderTextPart = (part: string, index: number) => {
    const cleanPart = removeBackTicks(part);
    const match = cleanPart.match(/zURL-(\d+)/);

    if (!match) {
      return <span key={`${id}-text-${part}-${index}`}>{cleanPart}</span>;
    }

    const urlIndex = parseInt(match[1], 10);
    const url = urlsWithIndexes[urlIndex];

    return (
      <UrlComponent
        key={`${id}-url-${urlIndex}`}
        url={url}
        goalId={id}
        urlIndex={urlIndex}
        isCodeSnippet={isCodeSnippet}
        copyCode={copyCode}
        title={title}
      />
    );
  };

  return (
    <div aria-hidden className="goal-title" onClick={handleClick} role="button" tabIndex={0}>
      {isImpossible && "! "}
      {textParts.map((part, index) => renderTextPart(part, index))}
    </div>
  );
};

export default React.memo(GoalTitle);
