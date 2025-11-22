import React from "react";
import { useNavigate } from "@tanstack/react-router";
import GlobalAddIcon from "@assets/images/globalAdd.svg";
import FabButton from "./FabButton";

const JournalFab: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: "/MyJournal",
      search: { mode: "addJournal" },
      state: (state) => ({ ...state }),
    });
  };

  return <FabButton icon={<img src={GlobalAddIcon} alt="add feeling" />} onClick={handleClick} />;
};

export default JournalFab;
