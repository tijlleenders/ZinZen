import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

const MyGroupActions: React.FC<MyGroupActionsProps> = () => {
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div className={`group-interactables${darkModeStatus ? "-dark" : ""}`}>
      <button
        type="button"
        className="join-group-button"
        onClickCapture={() => {
          console.log("join group button");
        }}
      >
        {" "}
        Join group
      </button>
    </div>
  );
};

export default MyGroupActions;
