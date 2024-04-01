import React from "react";
import { replaceUrlsWithText, summarizeUrl } from "@src/utils/patterns";
import { useTranslation } from "react-i18next";
import { GoalItem } from "@src/models/GoalItem";

interface GoalTitleProps {
  goal: GoalItem;
}

const GoalTitle: React.FC<GoalTitleProps> = ({ goal }) => {
  const { t } = useTranslation();
  const { id, title, link } = goal;
  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(t(title));

  // splitting the string
  const textParts = replacedString.split(/(zURL-\d+)/g);

  return (
    <div className="goal-title">
      {textParts.map((textPart, index) => {
        const replacedUrls = Array.from(textPart.matchAll(/zURL-(\d+)/g));
        if (replacedUrls.length) {
          return (
            <React.Fragment key={`${id}-${textPart}-replacedUrlsFragment`}>
              {replacedUrls.map(([url, digitStr]) => {
                const urlIndex = Number.parseInt(digitStr, 10);
                const originalUrl = urlsWithIndexes[urlIndex];
                const summarizedUrl = summarizeUrl(originalUrl);
                return (
                  <span
                    key={`${id}-${textPart}-${url}`}
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
        return <span key={`${id}-${textPart}`}>{index === 0 ? textPart : ` ${textPart}`}</span>;
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
