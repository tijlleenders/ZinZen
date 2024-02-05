import React from "react";
import { replaceUrlsWithText, summarizeUrl } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";

interface GoalTitleProps {
  goal: GoalItem;
  isImpossible: boolean;
}

const GoalTitle: React.FC<GoalTitleProps> = ({ goal, isImpossible }) => {
  const { t } = useTranslation();
  const { id, title, link } = goal;
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));

  const textParts = replacedString.split(/(zURL-\d+)/g);

  return (
    <div className="goal-title">
      {isImpossible && "! "}
      {textParts.map((textParts, index) => {
        const replacedUrls = Array.from(textParts.matchAll(/zURL-(\d+)/g));
        if (replacedUrls.length) {
          return (
            <React.Fragment key={`${id}-${textParts}-replacedUrlsFragment`}>
              {replacedUrls.map(([url, digitStr]) => {
                const urlIndex = Number.parseInt(digitStr, 10);
                const originalUrl = urlsWithIndexes[urlIndex];
                const summarizedUrl = summarizeUrl(originalUrl);
                return (
                  <span
                    key={`${id}-${textParts}-${url}`}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClickCapture={() => {
                      window.open(originalUrl, "_blank");
                    }}
                  >
                    {index === 0 ? summarizedUrl : ` ${summarizedUrl}`}
                  </span>
                );
              })}
            </React.Fragment>
          );
        }
        return <span key={`${id}-${textParts}`}>{index === 0 ? textParts : ` ${textParts}`}</span>;
      })}
      &nbsp;
      {link && (
        <a className="goal-link" href={link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">
          URL
        </a>
      )}
    </div>
  );
};

export default GoalTitle;
