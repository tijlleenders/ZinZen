// @ts-nocheck
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import deleteFeelingIcon from "@assets/images/deleteFeelingIcon.svg";
import noteIcon from "@assets/images/noteIcon.svg";
import { darkModeState } from "@store";
import { IFeelingItem } from "@models";
import { removeFeeling, addFeelingNote, removeFeelingNote } from "@api/FeelingsAPI";
import { feelingListType } from "@src/global";
import { feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";

interface ISetFeelingsListObject {
  feelingsList: feelingListType[];
  setFeelingsList: React.Dispatch<React.SetStateAction<feelingListType[]>>;
}
interface ISetSelectedFeeling {
  selectedFeeling: number;
  setSelectedFeeling: React.Dispatch<React.SetStateAction<number>>;
}
interface IProps {
  feelingsListObject: IFeelingItem[];
  setFeelingsListObject: ISetFeelingsListObject;
  currentFeelingsList: feelingListType[];
  handleFocus: ISetSelectedFeeling;
}

export const ShowFeelingTemplate: React.FC<IProps> = ({
  feelingsListObject,
  setFeelingsListObject,
  currentFeelingsList,
  handleFocus,
}) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showInputModal, setShowInputModal] = useState(-1);
  const [showNotesModal, setShowNotesModal] = useState(-1);
  const [selectedFeelingNote, setSelectedFeelingNote] = useState("");
  const [noteValue, setNoteValue] = useState("");

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

  const handleFeelingClick = (id: number) => {
    handleFocus.setSelectedFeeling(handleFocus.selectedFeeling === id ? -1 : id);
  };

  const handleJournalClick = (id: number) => {
    if (feelingsListObject[id].note) {
      setSelectedFeelingNote(feelingsListObject[id].note);
      handleNotesShow(feelingsListObject[id].id);
    } else handleInputShow(feelingsListObject[id].id);
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
  return (
    <div>
      <div>
        {feelingsListObject &&
          Object.keys(feelingsListObject).map((ID: string) => {
            const feelingId = Number(ID);
            return (
              <button
                type="button"
                key={feelingsListObject[feelingId].content + feelingsListObject[feelingId].date}
                className={`feelingOfDay${darkModeStatus ? "-dark" : ""}`}
                onClick={() => { handleFeelingClick(feelingsListObject[feelingId].id); }}
              >
                <div className="feelingOfDay-name">
                  {feelingsEmojis[feelingsListObject[feelingId].category]}&nbsp;
                  <span>{t(feelingsListObject[feelingId].content)}</span>
                </div>
                <div className="feelingOfDaty-options">
                  <img alt="add note to feeling" src={noteIcon} onClick={() => handleJournalClick(feelingId)} />
                  <img alt="delete feeling" src={deleteFeelingIcon} onClick={() => handleTrashClick(feelingId)} />
                </div>
              </button>
            );
          })}
      </div>
      <Modal
        show={showInputModal !== -1}
        onHide={handleInputClose}
        centered
        autoFocus={false}
        className={`notes-modal${darkModeStatus ? "-dark" : ""}`}
      >
        <Modal.Header closeButton>
          <Modal.Title className={darkModeStatus ? "note-modal-title-dark" : "note-modal-title-light"}>
            Want to tell more about it?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="text"
            placeholder="Add a reason"
            className={`notes-modal-input${darkModeStatus ? "-dark" : ""}`}
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
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            onClick={async () => {
              await handleFeelingsNoteModify(showInputModal);
              setNoteValue("");
              handleInputClose();
            }}
            className={`feelingsModal-btn${darkModeStatus ? "-dark" : ""}`}
          >
            Done
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showNotesModal !== -1}
        onHide={handleNotesClose}
        centered
        className={darkModeStatus ? "notes-modal-dark" : "notes-modal-light"}
      >
        <Modal.Body>
          <textarea readOnly className={`show-feeling__note-textarea${darkModeStatus ? "-dark" : ""}`} rows={5} cols={32} value={selectedFeelingNote} />
        </Modal.Body>
        <Modal.Footer>
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
            className={`feelingsModal-btn${darkModeStatus ? "-dark" : ""}`}
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
        </Modal.Footer>
      </Modal>
    </div>
  );
};
