/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @ts-nocheck
/* eslint-disable react/prop-types */
import { Modal } from "antd";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import deleteIcon from "@assets/images/deleteIcon.svg";
import noteIcon from "@assets/images/noteIcon.svg";
import { darkModeState } from "@store";
import { IFeelingItem } from "@models";
import { feelingListType } from "@src/global";
import { feelingsEmojis } from "@consts/FeelingsList";
import { ShowFeelingTemplateProps } from "@src/Interfaces/IPages";
import { removeFeeling, addFeelingNote, removeFeelingNote } from "@api/FeelingsAPI";
import { themeState } from "@src/store/ThemeState";

import "@translations/i18n";

export const ShowFeelingTemplate: React.FC<ShowFeelingTemplateProps> = ({
  feelingsListObject,
  setFeelingsListObject,
  currentFeelingsList,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showInputModal, setShowInputModal] = useState(-1);
  const [showNotesModal, setShowNotesModal] = useState(-1);
  const [selectedFeelingNote, setSelectedFeelingNote] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const theme = useRecoilValue(themeState);

  const handleInputClose = () => setShowInputModal(-1);
  const handleInputShow = (id) => setShowInputModal(id);
  const handleNotesClose = () => setShowNotesModal(-1);
  const handleNotesShow = (id) => setShowNotesModal(id);

  const handleFeelingsNoteModify = async (id: number) => {
    console.log(id, noteValue);
    const res = await addFeelingNote(id, noteValue);
    console.log(res);
    if (res) {
      const feelingsByDates: feelingListType[] = res.reduce((dates: Date[], feeling: IFeelingItem) => {
        if (dates[feeling.date]) {
          dates[feeling.date].push(feeling);
        } else {
          // eslint-disable-next-line no-param-reassign
          dates[feeling.date] = [feeling];
        }
        return dates;
      }, {});
      setFeelingsListObject.setFeelingsList({ ...feelingsByDates });
    }
  };

  const handleJournalClick = (id: number) => {
    if (feelingsListObject[id].note) {
      navigate("/MyJournal", {
        state: {
          ...location.state,
          displayNoteModal: feelingsListObject[id].id,
          note: feelingsListObject[id].note
        }
      });
    } else {
      navigate("/MyJournal", { state: { ...location.state, displayInputNoteModal: feelingsListObject[id].id } });
    }
  };

  const handleTrashClick = (id: number) => {
    const numFeelingId = feelingsListObject[id].id;
    if (numFeelingId) { removeFeeling(numFeelingId); } else { console.log("Attempting to remove feeling not in the database"); }
    const newFeelingsList = currentFeelingsList;
    const feelingDate = feelingsListObject[id].date;
    newFeelingsList[feelingDate] = currentFeelingsList[feelingDate].filter(
      (feelingOnDate: IFeelingItem) => feelingOnDate.id !== numFeelingId
    );
    setFeelingsListObject.setFeelingsList({ ...newFeelingsList });
  };

  const handleLocationChange = () => {
    const locationState : ILocationState = location.state || {};
    console.log(locationState, showNotesModal, showInputModal)
    if (showNotesModal !== -1) {
      handleNotesClose();
    } else if (locationState.displayNoteModal) {
      handleNotesShow(locationState.displayNoteModal);
    }
    if (showInputModal !== -1) {
      handleInputClose();
    } else if (locationState.displayInputNoteModal) {
      handleInputShow(locationState.displayInputNoteModal);
    }
  };

  useEffect(() => {
    handleLocationChange();
  }, [location]);

  return (
    <>
      <div>
        {feelingsListObject &&
          Object.keys(feelingsListObject).map((ID: string) => {
            const feelingId = Number(ID);
            return (
              <button
                type="button"
                key={feelingsListObject[feelingId].content + feelingsListObject[feelingId].date}
                className={`feelingOfDay${darkModeStatus ? "-dark" : ""}`}
              >
                <div className="feelingOfDay-name">
                  {feelingsEmojis[feelingsListObject[feelingId].category]}&nbsp;
                  <span>{t(feelingsListObject[feelingId].content)}</span>
                </div>
                <div className="feelingOfDaty-options">
                  <img alt="add note to feeling" className={`${darkModeStatus ? "dark-svg" : ""}`} src={noteIcon} onClick={() => handleJournalClick(feelingId)} />
                  <img alt="delete feeling" className={`${darkModeStatus ? "dark-svg" : ""}`} src={deleteIcon} onClick={() => handleTrashClick(feelingId)} />
                </div>
              </button>
            );
          })}
      </div>
      <Modal
        open={showInputModal !== -1}
        closable={false}
        footer={null}
        onCancel={() => window.history.back()}
        className={`${darkModeStatus ? "notes-modal-dark" : ""} popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      >
        <p className="popupModal-title">Want to tell more about it? </p>
        <div>
          <textarea
            rows={4}
              // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            placeholder="Write here..."
            className="notes-modal-input"
            value={noteValue}
            onChange={(e) => {
              setNoteValue(e.target.value);
            }}
              // Admittedly not the best way to do this but suffices for now
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleFeelingsNoteModify(showInputModal);
                setNoteValue("");
                handleInputClose();
              }
            }}
          />
        </div>
        <button
          type="submit"
          style={{ marginLeft: "auto", width: "fit-content" }}
          onClick={async () => {
            await handleFeelingsNoteModify(showInputModal);
            setNoteValue("");
            handleInputClose();
          }}
          className={`action-btn submit-icon${darkModeStatus ? "-dark" : ""}`}
        >
          Save Note
        </button>
      </Modal>
      <Modal
        open={showNotesModal !== -1}
        closable={false}
        footer={null}
        onCancel={() => window.history.back()}
        className={`notes-modal${darkModeStatus ? "-dark" : ""} popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      >
        <textarea readOnly className="show-feeling__note-textarea" rows={5} cols={32} value={selectedFeelingNote} />
        <button
          type="button"
          onClick={async () => {
            const newFeelingsList = await removeFeelingNote(showNotesModal);
            const feelingsByDates: feelingListType[] = newFeelingsList!.reduce(
              (dates: Date[], feeling: IFeelingItem) => {
                if (dates[feeling.date]) {
                  dates[feeling.date].push(feeling);
                } else {
                  // eslint-disable-next-line no-param-reassign
                  dates[feeling.date] = [feeling];
                }
                return dates;
              },
              {}
            );
            setFeelingsListObject.setFeelingsList({ ...feelingsByDates });
            handleNotesClose();
          }}
          className="feelingsModal-btn"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleNotesClose}
          className={`feelingsModal-btn${darkModeStatus ? "-dark" : ""}`}
        >
          Done
        </button>
      </Modal>
    </>
  );
};
