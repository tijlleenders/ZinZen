import React from "react";
import { useRecoilValue } from "recoil";

import ignore from "@assets/images/ignore.svg";

import { darkModeState } from "@src/store";

interface IgnoreBtnProps {
  deleteChanges: () => Promise<void>;
}
const IgnoreBtn = ({ deleteChanges }: IgnoreBtnProps) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <button
      type="button"
      style={{
        padding: "8px 15px",
        background: "var(--secondary-background)",
        justifyContent: "flex-start",
      }}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      onClick={deleteChanges}
    >
      <img alt="add changes" src={ignore} width={25} />
      &nbsp;Ignore all
    </button>
  );
};

export default IgnoreBtn;
