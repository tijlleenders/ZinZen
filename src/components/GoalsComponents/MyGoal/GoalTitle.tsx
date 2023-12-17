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

  //splitting the string
  const ele = replacedString.split(/(zURL-\d+)/g);

  return (
    <div className="goal-title">
      {ele.map((ele, index) => {
        const replacedUrls = Array.from(ele.matchAll(/zURL-(\d+)/g));
        if (replacedUrls.length) {
          return (
            <React.Fragment key={`${id}-${ele}-replacedUrlsFragment`}>
              {replacedUrls.map(([url, digitStr]) => {
                const urlIndex = Number.parseInt(digitStr, 10);
                const originalUrl = urlsWithIndexes[urlIndex];
                const summarizedUrl = summarizeUrl(originalUrl);
                return (
                  <span
                    key={`${id}-${ele}-${url}`}
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
        return <span key={`${id}-${ele}`}>{index === 0 ? ele : ` ${ele}`}</span>;
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
