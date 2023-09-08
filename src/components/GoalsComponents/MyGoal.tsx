import { Tooltip } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import pencil from "@assets/images/pencil.svg";
import mainAvatarDark from "@assets/images/mainAvatarDark.svg";
import mainAvatarLight from "@assets/images/mainAvatarLight.svg";
import { unarchiveIcon } from "@src/assets";

import useGoalStore from "@src/hooks/useGoalStore";
import NotificationSymbol from "@src/common/NotificationSymbol";
import { GoalItem } from "@src/models/GoalItem";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { darkModeState, displayPartner, lastAction, openInbox } from "@src/store";
import { replaceUrlsWithText, summarizeUrl } from "@src/utils/patterns";
import { getHistoryUptoGoal, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import { displayGoalId, displayUpdateGoal, goalsHistory, displayChangesModal } from "@src/store/GoalsState";

import { useTranslation } from "react-i18next";

interface MyGoalProps {
  goal: GoalItem;
  showActions: {
    open: string;
    click: number;
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
      // eslint-disable-next-line prettier/prettier
    }>
  >;
}

const GoalSent = ({ goal }: { goal: GoalItem }) => {
  const { t } = useTranslation();
  const onLength = goal.on.length;
  const onWeekdays = onLength === 5 && !goal.on.includes("Sat") && !goal.on.includes("Sun");
  const onWeekends = onLength === 2 && goal.on.includes("Sat") && goal.on.includes("Sun");

  const hasStarted = !!goal.start && new Date(goal.start).getTime() < new Date().getTime();
  const showStart = !!goal.due || !hasStarted;
  return (
    <>
      <div>
        {goal.duration && (
          <span>
            {goal.duration} {t(`hour${Number(goal.duration) > 1 ? "s" : ""}`)}
          </span>
        )}
        <span>
          {onLength > 0 &&
            !onWeekdays &&
            !onWeekends &&
            (onLength === 7 ? ` ${t("on any day of week")}` : ` ${t("on")} ${goal.on.map((ele) => t(ele)).join(" ")}`)}
          {onWeekdays && ` ${t("on")} ${t("weekdays")}`}
          {onWeekends && " on weekends"}
        </span>
      </div>
      <div>
        {goal.beforeTime && goal.afterTime
          ? `${t("between")} ${goal.afterTime}-${goal.beforeTime}`
          : goal.beforeTime
            ? `${t("before")} ${goal.beforeTime}`
            : goal.afterTime
              ? `${t("after")} ${goal.afterTime}`
              : ""}
      </div>
      {showStart && !!goal.start && (
        <div>
          {hasStarted ? t("started") : t("starts")} {new Date(goal.start).toDateString().slice(4)}
        </div>
      )}
      <div>{goal.due && `${t("ends")} ${new Date(goal.due).toDateString().slice(4)}`}</div>
      <div>{goal.habit === "weekly" && `${t("every")} week`}</div>
    </>
  );
};

const MyGoal: React.FC<MyGoalProps> = ({ goal, showActions, setShowActions }) => {
  const defaultTap = { open: "root", click: 1 };
  const archived = goal.archived === "true";
  const sharedWithContact = goal.shared.contacts.length > 0 ? goal.shared.contacts[0].name : null;
  const collabWithContact =
    goal.collaboration.collaborators.length > 0 ? goal.collaboration.collaborators[0].name : null;

  const navigate = useNavigate();
  const location = useLocation();
  const { handleDisplayChanges, handleUpdateGoal } = useGoalStore();
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);
  const isInboxOpen = useRecoilValue(openInbox);
  const showPartner = useRecoilValue(displayPartner);
  const setLastAction = useSetRecoilState(lastAction);

  const { urlsWithIndexes, replacedString } = replaceUrlsWithText(goal.title);

  const handleGoalClick = () => {
    if (showActions.open === goal.id && showActions.click > 0) {
      navigate("/MyGoals", {
        state: {
          ...location.state,
          activeGoalId: goal.id,
          goalsHistory: [
            ...subGoalHistory,
            {
              goalID: goal.id || "root",
              goalColor: goal.goalColor || "#ffffff",
              goalTitle: goal.title || "",
            },
          ],
        },
      });
    } else {
      setShowActions({ open: goal.id, click: 1 });
    }
  };
  async function handleDropDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    if (archived) {
      return;
    }
    if (
      (goal.collaboration.newUpdates && goal.typeOfGoal === "collaboration") ||
      goal.shared.conversionRequests.status
    ) {
      handleDisplayChanges();
      if (goal.shared.conversionRequests.status) {
        setShowChangesModal({ typeAtPriority: "conversionRequest", parentId: goal.id, goals: [] });
      } else {
        const res = await jumpToLowestChanges(goal.rootGoalId);
        const pathToGoal = await getHistoryUptoGoal(res.parentId);
        if (pathToGoal.length > 1) {
          pathToGoal.pop();
          setSubGoalHistory([...pathToGoal]);
          setSelectedGoalId(pathToGoal.slice(-1)[0].goalID);
        }
        setShowChangesModal(res);
      }
    } else {
      navigate("/MyGoals", {
        state: {
          ...location.state,
          from: "",
          displayGoalActions: goal,
        },
      });
    }
  }
  useEffect(() => {
    if (showActions !== defaultTap) {
      setShowActions(defaultTap);
    }
  }, [showChangesModal, showUpdateGoal, selectedGoalId]);

  useEffect(() => {
    if (location && location.pathname === "/MyGoals") {
      const { expandedGoalId } = location.state || {};
      if (expandedGoalId && showActions.open !== expandedGoalId) {
        setShowActions({ open: expandedGoalId, click: 1 });
      }
    }
  }, [location]);

  return (
    <div key={String(`goal-${goal.id}`)} className={`user-goal${darkModeStatus ? "-dark" : ""}`}>
      <div
        className="user-goal-main"
        style={{
          ...(goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root" ? { width: "80%" } : {}),
        }}
      >
        <div
          style={{
            padding: "20px 0",
            marginLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            className="goal-dropdown"
            onClickCapture={(e) => {
              handleDropDown(e);
            }}
          >
            <div
              className="goal-dd-outer"
              style={{
                borderColor: goal.sublist.length > 0 ? goal.goalColor : "transparent",
              }}
            >
              <div
                className="goal-dd-inner"
                style={{
                  background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 79.17%, ${goal.goalColor} 100%)`,
                }}
              >
                {(goal.collaboration.newUpdates || goal.shared.conversionRequests.status) && (
                  <NotificationSymbol color={goal.goalColor} />
                )}
              </div>
            </div>
          </div>
          {!archived && !isInboxOpen && !showPartner && showActions.open === goal.id && showActions.click > 0 && (
            <div
              className="goal-action"
              onClickCapture={() => {
                handleUpdateGoal(goal.id);
              }}
              style={{ textAlign: "right" }}
            >
              <img
                alt="Update Goal"
                src={pencil}
                style={{ cursor: "pointer", width: 24, height: 24 }}
                className={`${darkModeStatus ? "dark-svg" : ""}`}
              />
            </div>
          )}
        </div>
        <div aria-hidden className="goal-tile" onClick={handleGoalClick}>
          <div className="goal-title">
            {replacedString.split(" ").map((ele, index) => {
              if (ele.includes("zURL-")) {
                const urlIndex = Number(ele.split("-")[1]);
                const originalUrl = urlsWithIndexes[urlIndex];
                const summarizedUrl = summarizeUrl(originalUrl);
                console.log(originalUrl)

                return (
                  <span
                    key={`${goal.id}-${ele}`}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClickCapture={() => {
                      window.open(originalUrl, "_blank");
                    }}
                  >
                    {summarizedUrl}
                  </span>
                );
              } else {
                return <span key={`${goal.id}-${ele}`}>{ele}</span>;
              }
            })}
            &nbsp;
            {goal.link && (
              <a
                className="goal-link"
                href={goal.link}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                rel="noreferrer"
              >
                URL
              </a>
            )}
          </div>
          {showActions.open === goal.id && showActions.click > 0 && (
            <p className="goal-desc">
              <GoalSent goal={goal} />
            </p>
          )}
        </div>
      </div>
      {goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root" && (
        <Tooltip placement="top" title={sharedWithContact || collabWithContact}>
          <div className="contact-button" style={archived ? { right: "78px" } : {}}>
            {goal.typeOfGoal === "collaboration" && (
              <img
                alt="collaborate goal"
                width={25}
                src={darkModeStatus ? mainAvatarDark : mainAvatarLight}
                style={{ position: "absolute", right: "18px" }}
              />
            )}
            <button
              type="button"
              className="contact-icon"
              style={{
                background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 20% 79.17%, ${goal.goalColor} 100%)`,
              }}
            >
              {sharedWithContact?.charAt(0) || collabWithContact?.charAt(0) || ""}
            </button>
          </div>
        </Tooltip>
      )}
      {archived && (
        <div className="contact-button">
          <button
            type="button"
            className="contact-icon"
            style={{ padding: 0, background: "transparent", filter: darkModeStatus ? "invert(1)" : "none" }}
            onClickCapture={async () => {
              await unarchiveUserGoal(goal);
              setLastAction("unarchived");
            }}
          >
            <img alt="archived goal" src={unarchiveIcon} style={{ width: 18, height: 18 }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyGoal;
