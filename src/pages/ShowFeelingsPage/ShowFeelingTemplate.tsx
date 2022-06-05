/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Button, Nav, Container, Modal,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown, ChevronRight, TrashFill, Journal,
} from 'react-bootstrap-icons';

import { darkModeState } from '@store';
import { IFeelingItem } from '@models';
import { removeFeeling, addFeelingNote, removeFeelingNote } from '@api/FeelingsAPI';
import { feelingListType } from '@src/global';
import { feelingsEmojis } from '@consts/FeelingsList';

import '@translations/i18n';
import './ShowFeelingsPage.scss';

interface ISetFeelingsListObject {
  feelingsList: feelingListType[],
  setFeelingsList: React.Dispatch<React.SetStateAction<feelingListType[]>>
}

interface IProps {
  feelingsListObject: IFeelingItem[],
  setFeelingsListObject: ISetFeelingsListObject,
  currentFeelingsList: feelingListType[],
}

export const ShowFeelingTemplate: React.FC<IProps> = ({
  feelingsListObject,
  setFeelingsListObject,
  currentFeelingsList,
}) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<number>();
  const [selectedFeelingNote, setSelectedFeelingNote] = useState('');
  const [noteValue, setNoteValue] = useState('');

  const handleInputClose = () => setShowInputModal(false);
  const handleInputShow = () => setShowInputModal(true);
  const handleNotesClose = () => setShowNotesModal(false);
  const handleNotesShow = () => setShowNotesModal(true);

  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          {feelingsListObject && Object.keys(feelingsListObject)
            .map(((feelingId: string) => (
              <Button
                key={feelingsListObject[Number(feelingId)].content
                    + feelingsListObject[Number(feelingId)].date}
                className={
                    darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'show-btn-my-feelings-light'
                  }
                onClick={() => {
                  setShowOptions(!showOptions);
                  setSelectedFeeling(feelingsListObject[Number(feelingId)].id);
                }}
                size="lg"
              >
                {feelingsEmojis[feelingsListObject[Number(feelingId)].category]}
                <span className="btn-my-feelings__text">{t(feelingsListObject[Number(feelingId)].content)}</span>
                <i>
                  { (showOptions && (selectedFeeling === feelingsListObject[Number(feelingId)].id))
                    ? <ChevronDown />
                    : <ChevronRight />}
                </i>
                <br />
                {feelingsListObject[Number(feelingId)]?.note && (<span className="btn-my-feelings__note">...</span>)}
                {showOptions && (selectedFeeling === feelingsListObject[Number(feelingId)].id) && (
                <div className="show-feelings__options">
                  <TrashFill
                    onClick={() => {
                      const numFeelingId = feelingsListObject[Number(feelingId)].id;
                      if (numFeelingId !== undefined) { removeFeeling(numFeelingId); } else { console.log('Attempting to remove feeling not in the database'); }
                      const newFeelingsList = currentFeelingsList;
                      const feelingDate = feelingsListObject[Number(feelingId)].date;
                      newFeelingsList[feelingDate] = currentFeelingsList[feelingDate].filter(
                        (feelingOnDate: IFeelingItem) => feelingOnDate.id !== numFeelingId,
                      );
                      setFeelingsListObject.setFeelingsList({ ...newFeelingsList });
                    }}
                    size={20}
                  />
                  <Journal
                    onClick={() => {
                      if (feelingsListObject[Number(feelingId)]?.note) {
                        setSelectedFeelingNote(feelingsListObject[Number(feelingId)]?.note!);
                      }
                      // eslint-disable-next-line no-unused-expressions
                      feelingsListObject[Number(feelingId)]?.note
                        ? handleNotesShow()
                        : handleInputShow();
                    }}
                    size={20}
                  />
                </div>
                )}
              </Button>
            )))}
        </div>
        <div className="feelings-menu-mobile">
          <Nav className="navbar-custom">
            {feelingsListObject && Object.keys(feelingsListObject).map(
              ((feelingId: string) => (
                <Button
                  key={feelingsListObject[Number(feelingId)].content
                    + feelingsListObject[Number(feelingId)].date}
                  className={
                    darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'show-btn-my-feelings-light'
                  }
                  onClick={() => {
                    setShowOptions(!showOptions);
                    setSelectedFeeling(feelingsListObject[Number(feelingId)].id);
                  }}
                  size="lg"
                >
                  {feelingsEmojis[feelingsListObject[Number(feelingId)].category]}
                  <span className="btn-my-feelings__text">{t(feelingsListObject[Number(feelingId)].content)}</span>
                  <i>
                    { (showOptions
                      && (selectedFeeling === feelingsListObject[Number(feelingId)].id))
                      ? <ChevronDown />
                      : <ChevronRight />}
                  </i>
                  <br />
                  {feelingsListObject[Number(feelingId)]?.note && (<span className="btn-my-feelings__note">...</span>)}
                  {showOptions
                  && (selectedFeeling === feelingsListObject[Number(feelingId)].id) && (
                    <div className="show-feelings__options">
                      <TrashFill
                        onClick={() => {
                          const numFeelingId = feelingsListObject[Number(feelingId)].id;
                          if (numFeelingId !== undefined) { removeFeeling(numFeelingId); } else { console.log('Attempting to remove feeling not in the database'); }
                          const newFeelingsList = currentFeelingsList;
                          const feelingDate = feelingsListObject[Number(feelingId)].date;
                          newFeelingsList[feelingDate] = currentFeelingsList[feelingDate].filter(
                            (feelingOnDate: IFeelingItem) => feelingOnDate.id !== numFeelingId,
                          );
                          setFeelingsListObject.setFeelingsList({ ...newFeelingsList });
                        }}
                        size={20}
                      />
                      <Journal
                        onClick={() => {
                          if (feelingsListObject[Number(feelingId)]?.note) {
                            setSelectedFeelingNote(feelingsListObject[Number(feelingId)]?.note!);
                          }
                          // eslint-disable-next-line no-unused-expressions
                          feelingsListObject[Number(feelingId)]?.note
                            ? handleNotesShow()
                            : handleInputShow();
                        }}
                        size={20}
                      />
                    </div>
                  )}
                </Button>
              )),
            )}
            <Modal show={showInputModal} onHide={handleInputClose} centered>
              <Modal.Header closeButton>
                <Modal.Title><i>Want to tell more about it?</i></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input
                  type="text"
                  placeholder="Add a reason"
                  className="show-feelings__note-input"
                  value={noteValue}
                  onChange={(e) => { setNoteValue(e.target.value); }}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    addFeelingNote(selectedFeeling!, noteValue);
                    setFeelingsListObject.setFeelingsList(currentFeelingsList);
                    setNoteValue('');
                    handleInputClose();
                  }}
                  className="show-feelings__modal-button"
                >
                  Done
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showNotesModal} onHide={handleNotesClose} centered>
              <Modal.Body>
                <textarea readOnly className="show-feeling__note-textarea" rows={5} cols={32} value={selectedFeelingNote} />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    removeFeelingNote(selectedFeeling!);
                    setFeelingsListObject.setFeelingsList({ ...currentFeelingsList });
                    handleNotesClose();
                  }}
                  className="show-feelings__modal-button"
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNotesClose}
                  className="show-feelings__modal-button"
                >
                  Done
                </Button>
              </Modal.Footer>
            </Modal>
          </Nav>
        </div>
      </Container>
    </div>
  );
};
