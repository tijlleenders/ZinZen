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
import { darkModeState, lastAction, openInbox } from "@src/store";
import { replaceUrlsWithText } from "@src/utils/patterns";
import { getHistoryUptoGoal, jumpToLowestChanges } from "@src/helpers/GoalProcessor";
import {
  displayGoalId,
  displayUpdateGoal,
  displayShareModal,
  goalsHistory,
  displayChangesModal,
} from "@src/store/GoalsState";

import ShareGoalModal from "./ShareGoalModal/ShareGoalModal";

const eyeSvg =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC7klEQVR4nO2YSWhUQRCGv6gRERVXXBA8GRcIincFQQ8akoMIgjGQHPUgLgcJguPJZLp6JglxIZi4gIh4EKMRTcSroBIQUfAoSJR4iFnPkZKOPB8vTr/JSybg+6GgZ6ar6q/q6q7ugRQpUqRIkeJ/h8AWA8ct5AWeCXwUGBAYdaLjDwZ6LFgLx5phc0lJZ2GTwAWBNwITRcprgfOtsH7OiLfADgt3XGYnEpJhA50WKmaNuIW1Bq4JjEUQGBLoFmgUONQC21pg5UNYmIFFOtbABaoMXNRSEvgZYUeT0toEq5ImXyPwNcKhlk/dVVgW12YbrLBQL9AftmvgSxYOz5i4Zk83XQTx5znYP2MHwCSUWTgo0Bf2Y6FZV7Eow5pVt9RBowMGTjALmIQygQaB7yGfjzOwNJaxLCy38Cpk6NFcnBZ52GjgSch3b8a3TDOw2J3lwZps91lKnaP7RU8UgfcCP5zo+KZAdQYWeJbujVAQ3R1QXjAAgeshxUafwAX2CbwrdGQaeJuHvZ4ldSmk3/pPJe2QIWdXPMmfitkXRgyc9LFtwYR0j0ZO1Pp2LX9q4lOfsrFQW2wDs1BfyL5y0I0cPEjaYF1UFm8HDH/S5uNBvmKahuQrQ1nYWshPDlYLfA5URmd4QqWB8UAANYWMuqAfJHCNuO/p60hAR28DO4M/3gtE98LHoIEN01wr4sqY7/EcanZ3/5y7uqkc+XEDuz2NNSRAfsJ3LyiysCegN/w7cANn4mbfBdCUVAACTTH89gb0TusXLwOZqPU15JpVUgF0xQigLqDXh+uU+mGkHdb4GnKvr6RKKO/rVzlOlbyFQc1kxsCgdj1fIy6AcwmuwNk4vgUu2yI4/4Uc7EoqgBxUUgpEPUaKkP6SkHcBVCcQQBWlhIFbxZI34StBKZCBJeH3gyf5HtVlPkAfGu7a63OlHtW3rj5amG9wf510CXyLID7g/vvZznxHB5TrbdHAARUdez0HU6RIkSJFihQpmFP8Akw1EIG66+t0AAAAAElFTkSuQmCC";

interface MyGoalProps {
  goal: GoalItem;
  showActions: {
    open: string,
    click: number,
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string,
      click: number,
      // eslint-disable-next-line prettier/prettier
    }>
  >;
}

const GoalSent = ({ goal }: { goal: GoalItem }) => {
  const onLength = goal.on.length;
  const onWeekdays = onLength === 5 && !goal.on.includes("Sat") && !goal.on.includes("Sun");
  const onWeekends = onLength === 2 && goal.on.includes("Sat") && goal.on.includes("Sun");
  return (
    <>
      <div>
        {goal.duration && (
          <span>
            {goal.duration} hour{Number(goal.duration) > 1 && "s"}
          </span>
        )}
        <span>
          {onLength > 0 &&
            !onWeekdays &&
            !onWeekends &&
            (onLength === 7 ? " on any day of week" : ` on ${goal.on.join(" ")}`)}
          {onWeekdays && " on weekdays"}
          {onWeekends && " on weekends"}
        </span>
      </div>
      <div>
        {goal.beforeTime && goal.afterTime
          ? `between ${goal.afterTime}-${goal.beforeTime}`
          : goal.beforeTime
            ? `before ${goal.beforeTime}`
            : goal.afterTime
              ? `after ${goal.afterTime}`
              : ""}
      </div>
      <div>
        <span>{(goal.timeBudget.perDay || goal.timeBudget.perWeek) && "max "}</span>
        {goal.timeBudget.perDay && <span>{goal.timeBudget.perDay} h / day</span>}
        {goal.timeBudget.perWeek && (
          <span>{`${goal.timeBudget.perDay ? ", " : ""}${goal.timeBudget.perWeek} h / week`}</span>
        )}
      </div>
      <div>{goal.start && `starts ${new Date(goal.start).toDateString().slice(4)}`}</div>
      <div>{goal.due && `end ${new Date(goal.due).toDateString().slice(4)}`}</div>
      <div>{goal.habit === "weekly" && "every week"}</div>
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
  const showShareModal = useRecoilValue(displayShareModal);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const [selectedGoalId, setSelectedGoalId] = useRecoilState(displayGoalId);
  const [showChangesModal, setShowChangesModal] = useRecoilState(displayChangesModal);
  const [subGoalHistory, setSubGoalHistory] = useRecoilState(goalsHistory);
  const isInboxOpen = useRecoilValue(openInbox);

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
        <div style={{ marginLeft: 20, display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            className="goal-dropdown"
            onClickCapture={(e) => {
              handleDropDown(e);
            }}
          >
            {(goal.collaboration.newUpdates || goal.shared.conversionRequests.status) && (
              <NotificationSymbol color={goal.goalColor} />
            )}
            {goal.sublist.length > 0 && (
              <div
                className="goal-dd-outer"
                style={{
                  top: showActions.open === goal.id && showActions.click > 0 ? -2.3 : -2.5,
                  borderColor: goal.goalColor,
                }}
              />
            )}
            <div
              className="goal-dd-inner"
              style={{
                background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 79.17%, ${goal.goalColor} 100%)`,
              }}
            />
          </div>
          {!archived && showActions.open === goal.id && showActions.click > 0 && (
            <div
              className="goal-action"
              onClickCapture={() => {
                handleUpdateGoal(goal.id);
              }}
              style={{ textAlign: "right" }}
            >
              <img
                alt="Update Goal"
                src={isInboxOpen ? eyeSvg : pencil}
                style={{ cursor: "pointer", width: 24, height: 24 }}
                className={`${darkModeStatus ? "dark-svg" : ""}`}
              />
            </div>
          )}
        </div>
        <div aria-hidden className="goal-tile" onClick={handleGoalClick}>
          <div style={{ overflow: "hidden", width: "100%" }}>
            <div className="goal-title">
              {replacedString.split(" ").map((ele) => (
                <span
                  key={`${goal.id}-${ele}`}
                  style={ele.includes("zURL-") ? { cursor: "pointer", textDecoration: "underline" } : {}}
                  onClickCapture={() => {
                    if (ele.includes("zURL-")) {
                      const urlIndex = Number(ele.split("-")[1]);
                      window.open(urlsWithIndexes[urlIndex], "_blank");
                    }
                  }}
                >
                  {`${ele.includes("zURL-") ? "URL" : ` ${ele} `}`}
                </span>
              ))}
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
      {showShareModal === goal.id && <ShareGoalModal goal={goal} />}
    </div>
  );
};

export default MyGoal;
