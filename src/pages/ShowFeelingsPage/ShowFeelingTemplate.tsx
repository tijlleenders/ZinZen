/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @ts-nocheck
/* eslint-disable react/prop-types */
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
import ZModal from "@src/common/ZModal";
import { removeFeeling, addFeelingNote, removeFeelingNote } from "@api/FeelingsAPI";

import "@translations/i18n";
import { getJustDate } from "@src/utils";

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

  const handleInputClose = () => setShowInputModal(-1);
  const handleInputShow = (id) => setShowInputModal(id);
  const handleNotesClose = () => setShowNotesModal(-1);
  const handleNotesShow = (id) => setShowNotesModal(id);

  const handleFeelingsNoteModify = async (id: number, note: string) => {
    console.log(id, note);
    const res = await addFeelingNote(id, note);
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
          note: feelingsListObject[id].note,
        },
      });
    } else {
      navigate("/MyJournal", { state: { ...location.state, displayInputNoteModal: feelingsListObject[id].id } });
    }
  };

  const handleTrashClick = (id: number) => {
    const numFeelingId = feelingsListObject[id].id;
    if (numFeelingId) {
      removeFeeling(numFeelingId);
    } else {
      console.log("Attempting to remove feeling not in the database");
    }
    const newFeelingsList = { ...currentFeelingsList };
    const feelingDate = feelingsListObject[id].date;
    newFeelingsList[feelingDate] = newFeelingsList[feelingDate].filter(
      (feelingOnDate: IFeelingItem) => feelingOnDate.id !== numFeelingId,
    );
    const todayString = getJustDate(new Date()).toString();

    if (newFeelingsList[feelingDate].length === 0 && feelingDate.toString() !== todayString) {
      delete newFeelingsList[feelingDate];
    }
    setFeelingsListObject.setFeelingsList(newFeelingsList);
  };

  const handleLocationChange = () => {
    const locationState: ILocationState = location.state || {};
    if (showNotesModal !== -1) {
      handleNotesClose();
    } else if (locationState.displayNoteModal) {
      handleNotesShow(locationState.displayNoteModal);
      setSelectedFeelingNote(locationState.note);
    }
    if (showInputModal !== -1) {
      handleInputClose();
      setNoteValue("");
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
                  <div className="feelingOfDay-content">
                    <span>{t(feelingsListObject[feelingId].content)}</span>
                    <br />
                    <span style={{ fontSize: "0.875rem", opacity: "0.8", wordBreak: "break-word" }}>
                      {t(feelingsListObject[feelingId].note)}
                    </span>
                  </div>
                </div>
                <div className="feelingOfDaty-options">
                  <img
                    alt="add note to feeling"
                    className={`${darkModeStatus ? "dark-svg" : ""}`}
                    src={noteIcon}
                    onClick={() => handleJournalClick(feelingId)}
                  />
                  <img
                    alt="delete feeling"
                    className={`${darkModeStatus ? "dark-svg" : ""}`}
                    src={deleteIcon}
                    onClick={() => handleTrashClick(feelingId)}
                  />
                </div>
              </button>
            );
          })}
      </div>
      <ZModal
        open={showInputModal !== -1}
        onCancel={() => window.history.back()}
        type={`${darkModeStatus ? "notes-modal-dark" : ""}`}
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
                await handleFeelingsNoteModify(showInputModal, noteValue);
                window.history.back();
              }
            }}
          />
        </div>
        <button
          type="submit"
          style={{ marginLeft: "auto", width: "fit-content" }}
          onClick={async () => {
            await handleFeelingsNoteModify(showInputModal, noteValue);
            window.history.back();
          }}
          className={`action-btn submit-icon${darkModeStatus ? "-dark" : ""}`}
        >
          Save Note
        </button>
      </ZModal>
      <ZModal
        open={showNotesModal !== -1}
        onCancel={() => window.history.back()}
        className={`notes-modal${darkModeStatus ? "-dark" : ""}`}
      >
        <textarea
          className="show-feeling__note-textarea"
          rows={5}
          cols={32}
          value={selectedFeelingNote}
          onChange={(e) => {
            setSelectedFeelingNote(e.target.value);
          }}
        />
        <div className="show-feeling-actions">
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
                {},
              );
              setFeelingsListObject.setFeelingsList({ ...feelingsByDates });
              window.history.back();
            }}
            className="feelingsModal-btn"
            style={{
              background: "transparent",
              boxShadow: darkModeStatus ? "rgba(255, 255, 255, 0.25) 0px 1px 2px" : "0px 1px 2px rgba(0, 0, 0, 0.25)",
            }}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={async () => {
              await handleFeelingsNoteModify(showNotesModal, selectedFeelingNote);
              window.history.back();
            }}
            className={`feelingsModal-btn${darkModeStatus ? "-dark" : ""}`}
            style={{
              background: "var(--primary-background)",
              boxShadow: darkModeStatus ? "rgba(255, 255, 255, 0.25) 0px 1px 2px" : "0px 1px 2px rgba(0, 0, 0, 0.25)",
            }}
          >
            Done
          </button>
        </div>
      </ZModal>
    </>
  );
};
