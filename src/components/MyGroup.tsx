import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { RetrievePublicGroupGoalItem } from "@src/models/RetrievePublicGroupGoalItem";
import MyGroupActions from "./MyGroupActions";

interface MyGroupProps {
  group: RetrievePublicGroupGoalItem;
  showActions: {
    open: "root group";
    click: 1;
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
    }>
  >;
  setLastAction: React.Dispatch<React.SetStateAction<string>>;
}
const MyGroup: React.FC<MyGroupProps> = ({ group, showActions, setShowActions, setLastAction }) => {
  const defaultTap = { open: "root group", click: 1 };

  const darkModeStatus = useRecoilValue(darkModeState);

  const handleGroupClick = () => {
    if (showActions.open === group.id && showActions.click > 0) {
      setShowActions(defaultTap);
    } else {
      setShowActions({ open: group.id, click: 1 });
    }
  };
  function handleDropDown() {
    setShowActions(defaultTap);
  }

  useEffect(() => {
    setShowActions(defaultTap);
  }, []);

  return (
    <div key={String(`goal-${group.id}`)} className={`user-goal${darkModeStatus ? "-dark" : ""}`}>
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
            height: showActions.open === group.id && showActions.click > 0 ? "90%" : "80%",
            background: "radial-gradient(50% 50% at 50% 50%, #A963B933 79.17%, #A963B9 100%)",
          }}
        />
      </div>
      <div
        className="user-goal-main"
        onClickCapture={() => {
          handleGroupClick();
        }}
        style={{ ...(showActions.open === group.id ? { paddingBottom: 0 } : {}) }}
      >
        <div aria-hidden className="goal-title" suppressContentEditableWarning>
          <div>{group.title}</div>&nbsp;
        </div>
      </div>
      {showActions.open === group.id && showActions.click > 0 && (
        <MyGroupActions group={group} setLastAction={setLastAction} />
      )}
    </div>
  );
};

export default MyGroup;
