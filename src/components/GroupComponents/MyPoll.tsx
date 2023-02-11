import React, { useEffect } from "react";

import plus from "@assets/images/plus.svg";

import { IPoll, PollActionType } from "@src/models/PublicGroupItem";
import { darkModeState, displayToast, lastAction } from "@src/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { addGoal } from "@src/api/GoalsAPI";
import { addSubInPub } from "@src/api/PubSubAPI";
import { displayGroup } from "@src/store/GroupsState";
import { sendUpdatesOfThisPoll } from "@src/helpers/GroupsProcessor";
import MyPollActions from "./MyPollActions";

interface MyPollProps {
    poll: IPoll,
    showActions: {
      open: string;
      click: number;
  },
  setShowActions: React.Dispatch<React.SetStateAction<{
    open: string;
    click: number;
  }>>
}

const MyPoll = ({ poll, showActions, setShowActions }: MyPollProps) => {
  const { goal } = poll;
  const defaultTap = { open: "root", click: 1 };
  const action = useRecoilValue(lastAction);
  const selectedGroup = useRecoilValue(displayGroup);
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);

  const handleGoalClick = () => {
    if (showActions.open === poll.id && showActions.click > 0) {
      setShowActions(defaultTap);
    } else { setShowActions({ open: poll.id, click: 1 }); }
  };
  async function handleDropDown() {
    if (showActions.open === poll.id && showActions.click > 0) {
      setShowActions(defaultTap);
    } else setShowActions({ open: poll.id, click: 1 });
  }

  const handlePollAction = async (typeOfAction: PollActionType) => {
    if (typeOfAction.includes("Votes") && poll.myMetrics.voteScore !== 0) {
      setShowToast({ open: true, message: "You've already voted ;)", extra: "" });
    } else if (selectedGroup) {
      const newMetricsState = { ...poll.myMetrics };
      if (typeOfAction === "inMyGoals") {
        newMetricsState.inMyGoals = true;
        await addGoal({ ...poll.goal, parentGoalId: "root" });
        addSubInPub(poll.goal.id, selectedGroup?.id, "publicGroup");
        setShowToast({ open: true, message: "Added To My Goals", extra: "" });
      } else if (typeOfAction.includes("Votes")) {
        newMetricsState.voteScore = typeOfAction === "upVotes" ? 1 : -1;
        setShowToast({ open: true, message: "Your vote is submitted", extra: "" });
      }
      await sendUpdatesOfThisPoll(selectedGroup.id, poll.id, newMetricsState, typeOfAction);
      setLastAction("groupAction");
    }
  };
  useEffect(() => {
    if (action === "groupAction") {
      setShowActions(defaultTap);
    }
  }, [action]);
  return (
    <div
      key={String(`poll-${poll.id}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""}`}
    >
      <div
        className="goal-dropdown"
        onClickCapture={(e) => {
          e.stopPropagation();
          handleDropDown();
        }}
      >
        <div
          className="goal-dd-inner"
          style={{
            height: showActions.open === poll.id && showActions.click > 0 ? "90%" : "80%",
            background: `radial-gradient(50% 50% at 50% 50%, ${goal.goalColor}33 79.17%, ${goal.goalColor} 100%)`
          }}
        />
      </div>
      <div
        className="user-goal-main"
        onClickCapture={() => { handleGoalClick(); }}
        style={{ ...(showActions.open === poll.id) ? { paddingBottom: 0 } : {} }}
      >
        <div
          aria-hidden
          className="goal-title"
          suppressContentEditableWarning
        >
          <div>{goal.title}</div>&nbsp;
          { goal.link && <a className="goal-link" href={goal.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">URL</a>}
        </div>
        { !poll.myMetrics.inMyGoals && (
          <button
            type="button"
            style={{
              background: "transparent",
              border: "none",
              filter: `invert(${darkModeStatus ? 1 : 0.4})`,
              position: "absolute",
              right: "30px",
            }}
            onClickCapture={async (e) => {
              e.stopPropagation();
              await handlePollAction("inMyGoals");
            }}
          >
            <img alt="goal suggestion" src={plus} style={{ filter: "brightness(1) invert(0)" }} />
          </button>
        )}
      </div>

      { showActions.open === poll.id && showActions.click > 0 && (
        <MyPollActions poll={poll} handleClick={handlePollAction} />
      )}
    </div>
  );
};

export default MyPoll;
