import React from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { IFeelingItem } from "@src/models";
import { darkModeState } from "@src/store";
import { deleteFeeling } from "@src/api/FeelingsAPI";
import { feelingsEmojis } from "@src/constants/FeelingsList";

import noteIcon from "@assets/images/noteIcon.svg";
import deleteIcon from "@assets/images/deleteIcon.svg";

const ActionBtn = ({ icon, handleClick }: { icon: string; handleClick: () => void }) => {
  const darkMode = useRecoilValue(darkModeState);
  return (
    <button type="button" className="simple" onClick={handleClick}>
      <img alt="" className={`${darkMode ? "dark-svg" : ""}`} src={icon} />
    </button>
  );
};

const Feeling = ({ data }: { data: IFeelingItem }) => {
  const { id, content, date, category, note } = data;
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const darkMode = useRecoilValue(darkModeState);

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
    <button
      type="button"
      key={content + date}
      className={`place-middle w-100 justify-sb feelingOfDay${darkMode ? "-dark" : ""} simple 
    `}
    >
      <div className="place-middle feelingOfDay-name fw-600">
        {feelingsEmojis[category]}&nbsp;
        <div className="feelingOfDay-content">
          <span>{t(content)}</span>
          <br />
          <span style={{ fontSize: "0.875rem", opacity: "0.8", wordBreak: "break-word" }}>{t(note || "")}</span>
        </div>
      </div>
      <div className="d-flex justify-fe gap-16">
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
