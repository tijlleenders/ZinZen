import React from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { IFeelingItem } from "@src/models";
import { darkModeState } from "@src/store";

import deleteIcon from "@assets/images/deleteIcon.svg";
import noteIcon from "@assets/images/noteIcon.svg";
import { feelingsEmojis } from "@src/constants/FeelingsList";
import { useQueryClient } from "react-query";
import { deleteFeeling } from "@src/api/FeelingsAPI";

const ActionBtn = ({ icon, handleClick }: { icon: string; handleClick: () => void }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <button type="button" className="ordinary-element" onClick={handleClick}>
      <img alt="" className={`${darkModeStatus ? "dark-svg" : ""}`} src={icon} />
    </button>
  );
};
const Feeling = ({ data }: { data: IFeelingItem }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { id, content, date, category, note } = data;
  const location = useLocation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleJournalClick = () => {
    navigate("/MyJournal", {
      state: {
        ...location.state,
        feelingDate: date,
        displayNoteModal: id,
        note,
      },
    });
  };

  return (
    <button type="button" key={content + date} className={`feelingOfDay${darkModeStatus ? "-dark" : ""}`}>
      <div className="feelingOfDay-name">
        {feelingsEmojis[category]}&nbsp;
        <div className="feelingOfDay-content">
          <span>{t(content)}</span>
          <br />
          <span style={{ fontSize: "0.875rem", opacity: "0.8", wordBreak: "break-word" }}>{t(note || "")}</span>
        </div>
      </div>
      <div className="feelingOfDaty-options">
        <ActionBtn icon={noteIcon} handleClick={handleJournalClick} />
        <ActionBtn
          icon={deleteIcon}
          handleClick={async () => {
            await deleteFeeling(id!);
            queryClient.invalidateQueries("feelings");
          }}
        />
      </div>
    </button>
  );
};

export default Feeling;
