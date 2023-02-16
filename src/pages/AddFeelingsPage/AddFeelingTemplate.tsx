// @ts-nocheck
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "react-bootstrap-icons";
import { Button, Navbar, Container, Modal } from "react-bootstrap";

import { addFeeling, addFeelingWithNote } from "@api/FeelingsAPI";
import { darkModeState } from "@store";
import { feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";
import "./AddFeelingsPage.scss";

export const FeelingTemplate = ({
  feelingCategory,
  feelingsList,
  feelingDate,
}: {
  feelingCategory: string;
  feelingsList: string[];
  feelingDate: Date;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);

  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [feelingNote, setFeelingNote] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState(feelingCategory);

  const addThisFeeling = () => {
    if (feelingNote && feelingNote !== "") {
      addFeelingWithNote(selectedFeeling, feelingCategory, feelingDate, feelingNote);
    } else {
      addFeeling(selectedFeeling, feelingCategory, feelingDate);
    }
    setTimeout(() => {
      navigate("/MyFeelings", { replace: true });
    }, 100);
  };
  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
            {t(feelingCategory)}
            {feelingsEmojis[feelingCategory]}
          </Button>
          <br />
          {feelingsList.map((feelingName) => (
            <Button
              key={feelingName}
              className={
                darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"
              }
              size="lg"
              onClick={() => {
                addFeeling(feelingName, feelingCategory, feelingDate);
                setTimeout(() => {
                  navigate("/MyFeelings", { replace: true });
                }, 100);
              }}
            >
              {t(feelingName)}
            </Button>
          ))}
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <div className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
              <button
                type="button"
                className={`feelings-name-${darkModeStatus ? "dark" : "light"}`}
                onClick={() => addThisFeeling()}
              >
                {feelingsEmojis[feelingCategory]}&nbsp;&nbsp;
                {t(feelingCategory)}
              </button>
              <button
                className={`feelings-expand-btw-${darkModeStatus ? "dark" : "light"}`}
                type="button"
                onClick={() => {
                  setShowFeelingModal(true);
                }}
              >
                <div>
                  <ChevronRight />
                </div>
              </button>
            </div>
          </Navbar>
        </div>
        <Modal
          show={showFeelingModal}
          onHide={() => setShowFeelingModal(false)}
          centered
          autoFocus={false}
          className={darkModeStatus ? "notes-modal-dark" : "notes-modal-light"}
        >
          <Modal.Header closeButton id="feeling-modal-header">
            <Modal.Title className={darkModeStatus ? "note-modal-title-dark" : "note-modal-title-light"}>
              {`You feel ${t(feelingCategory)}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id="feeling-modal-body">
            <h2 id="feeling-reason-ques">Can you be more specific?</h2>
            <input
              type="text"
              placeholder="I Feel..."
              id="myfeelings-custom-feeling-input"
              onChange={(e) => {
                setSelectedFeeling(e.target.value);
              }}
            />
            <div id="feelingOptions">
              {feelingsList.map((feeling) => (
                <button
                  type="button"
                  className={`feelingOption-name feelingOption-${selectedFeeling === feeling ? "selected" : ""}`}
                  key={`feelingOption-${feeling}`}
                  onClick={() => {
                    setSelectedFeeling(feeling);
                  }}
                >
                  {t(feeling)}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add Note"
              id="myfeelings-note-input"
              onChange={(e) => {
                setFeelingNote(e.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                addThisFeeling();
                setShowFeelingModal(false);
              }}
              className="show-feelings__modal-button"
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};
