import { IPoll } from "@src/models/PublicGroupItem";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";
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
  const darkModeStatus = useRecoilValue(darkModeState);

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

      </div>

      { showActions.open === poll.id && showActions.click > 0 && (
        <MyPollActions poll={poll} />
      )}
    </div>
  );
};

export default MyPoll;
