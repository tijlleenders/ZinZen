// @ts-nocheck
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, TrashFill, Journal } from "react-bootstrap-icons";

import { darkModeState } from "@store";
import { IFeelingItem } from "@models";
import { removeFeeling, addFeelingNote, removeFeelingNote } from "@api/FeelingsAPI";
import { feelingListType } from "@src/global";
import { feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";
import "./ShowFeelingsPage.scss";

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
  const [showInputModal, setShowInputModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedFeelingNote, setSelectedFeelingNote] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const handleInputClose = () => setShowInputModal(false);
  const handleInputShow = () => setShowInputModal(true);
  const handleNotesClose = () => setShowNotesModal(false);
  const handleNotesShow = () => setShowNotesModal(true);
  const handleFeelingsNoteModify = async () => {
    addFeelingNote(handleFocus.selectedFeeling!, noteValue).then((newFeelingsList) => {
      const feelingsByDates: feelingListType[] = newFeelingsList!.reduce((dates: Date[], feeling: IFeelingItem) => {
        if (dates[feeling.date]) {
          dates[feeling.date].push(feeling);
        } else {
          // eslint-disable-next-line no-param-reassign
          dates[feeling.date] = [feeling];
        }
        return dates;
      }, {});
      setFeelingsListObject.setFeelingsList({ ...feelingsByDates });
    });
  };

  const handleFeelingClick = (id: number) => {
    handleFocus.setSelectedFeeling(handleFocus.selectedFeeling === id ? -1 : id);
  };

  const handleJournalClick = (id: number) => {
    if (feelingsListObject[id]?.note) setSelectedFeelingNote(feelingsListObject[id]?.note!);
    if (feelingsListObject[id]?.note) handleNotesShow();
    else handleInputShow();
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
      <Container fluid>
        <div>
          {feelingsListObject &&
            Object.keys(feelingsListObject).map((ID: string) => {
              const feelingId = Number(ID);
              return (
                <Button
                  key={feelingsListObject[feelingId].content + feelingsListObject[feelingId].date}
                  className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "show-btn-my-feelings-light"}
                  size="lg"
                >
                  <div
                    className="btn-my-feelings_container"
                    aria-hidden="true"
                    onClick={() => {
                      handleFeelingClick(feelingsListObject[feelingId].id);
                    }}
                  >
                    <div>
                      {feelingsEmojis[feelingsListObject[feelingId].category]}
                      <span className="btn-my-feelings__text">{t(feelingsListObject[feelingId].content)}</span>
                    </div>
                    <div>
                      <div>
                        {handleFocus.selectedFeeling === feelingsListObject[feelingId].id ? (
                          <ChevronDown />
                        ) : (
                          <ChevronRight />
                        )}
                      </div>
                    </div>
                  </div>
                  {feelingsListObject[feelingId]?.note && (
                  <span
                    aria-hidden="true"
                    className="btn-my-feelings__note"
                    onClick={() => {
                      handleFeelingClick(feelingsListObject[feelingId].id);
                    }}
                  >
                    {handleFocus.selectedFeeling === feelingsListObject[feelingId].id
                      ? `${feelingsListObject[feelingId].note}`
                      : "..."}
                  </span>
                  )}
                  {handleFocus.selectedFeeling === feelingsListObject[feelingId].id && (
                  <div className="show-feelings__options">
                    <TrashFill
                      onClick={() => handleTrashClick(feelingId)}
                      size={20}
                    />
                    <Journal
                      onClick={() => handleJournalClick(feelingId)}
                      size={20}
                    />
                  </div>
                  )}
                </Button>
              );
            })}
        </div>
        <Modal
          show={showInputModal}
          onHide={handleInputClose}
          centered
          autoFocus={false}
          className={darkModeStatus ? "notes-modal-dark" : "notes-modal-light"}
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
              className="show-feelings__note-input"
              value={noteValue}
              onChange={(e) => {
                setNoteValue(e.target.value);
              }}
              // Admittedly not the best way to do this but suffices for now
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFeelingsNoteModify();
                  setNoteValue("");
                  handleInputClose();
                }
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                handleFeelingsNoteModify();
                setNoteValue("");
                handleInputClose();
              }}
              className="show-feelings__modal-button"
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showNotesModal}
          onHide={handleNotesClose}
          centered
          className={darkModeStatus ? "notes-modal-dark" : "notes-modal-light"}
        >
          <Modal.Body>
            <textarea readOnly className="show-feeling__note-textarea" rows={5} cols={32} value={selectedFeelingNote} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={async () => {
                const newFeelingsList = await removeFeelingNote(handleFocus.selectedFeeling!);
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
              className="show-feelings__modal-button"
            >
              Delete
            </Button>
            <Button variant="primary" onClick={handleNotesClose} className="show-feelings__modal-button">
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};
