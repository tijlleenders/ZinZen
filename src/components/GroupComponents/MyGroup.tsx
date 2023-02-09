import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";

interface MyGroupProps {
  group: { publicGroupId: string, title: string },
  showActions: {
    open: string;
    click: number;
  },
  setShowActions: React.Dispatch<React.SetStateAction<{
    open: string;
    click: number;
  }>>
}
const MyGroup = ({ group, showActions, setShowActions }: MyGroupProps) => {
  const defaultTap = { open: "root", click: 1 };
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleDropDown = () => {
    if (showActions.open === group.publicGroupId && showActions.click > 0) {
      setShowActions(defaultTap);
    } else setShowActions({ open: group.publicGroupId, click: 1 });
  };

  const handleGoalClick = () => {
    if (group.polls.length === 0) {
      if (showActions.open === group.publicGroupId && showActions.click > 0) {
        setShowActions(defaultTap);
      } else { setShowActions({ open: group.publicGroupId, click: 1 }); }
    } else {
      // @ts-ignore
      addInHistory(goal);
    }
  };

  return (
    <div
      key={String(`goal-${group.publicGroupId}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""}`}
    >
      <div
        className="goal-dropdown"
        onClickCapture={(e) => {
          e.stopPropagation();
          handleDropDown();
        }}
      >
        {/* { group.polls.length > 0 && (
          <div
            className="goal-dd-outer"
            style={{ borderColor: group.groupColor }}
          />
        )} */}
        {/* <div
          className="goal-dd-inner"
          style={{
            height: showActions.open === group.publicGroupId && showActions.click > 0 ? "90%" : "80%",
            background: `radial-gradient(50% 50% at 50% 50%, ${group.groupColor}33 79.17%, ${group.groupColor} 100%)`
          }}
        /> */}
      </div>
      <div
        className="user-goal-main"
        onClickCapture={() => { handleGoalClick(); }}
        style={{ ...(showActions.open === group.publicGroupId) ? { paddingBottom: 0 } : {} }}
      >
        <div
          aria-hidden
          className="goal-title"
          suppressContentEditableWarning
        >
          <div>{group.title}</div>&nbsp;
        </div>

      </div>
      { showActions.open === group.publicGroupId && showActions.click > 0 && (
        <p>s</p>
      )}
    </div>
  );
};

export default MyGroup;
