import { confirmationHeaders } from "@src/constants/confirmationHeaders";
import { ConfirmationModalProps } from "@src/Interfaces/IPopupModals";
import { darkModeState, showConfirmation } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ action, handleClick }) => {
  const { actionCategory, actionName } = action;
  const darkModeStatus = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeState);

  const [neverShowAgain, setNeverShowAgain] = useState(false);
  const [displayModal, setDisplayModal] = useRecoilState(showConfirmation);
  // @ts-ignore
  const { header, note } = confirmationHeaders[actionCategory][actionName];
  const getConfirmButtonText = () => {
    let confirmButtonText = "Confirm";
    switch (actionName) {
      case "archive":
        confirmButtonText = `${confirmButtonText} goal`;
        break;
      case "shareAnonymously":
      case "shareWithOne":
      case "colabRequest":
        confirmButtonText = `${confirmButtonText} sharing goal`;
        break;
      default:
        break;
    }

    return confirmButtonText;
  };

  const getChoiceButton = (choice: string) => (
    <button
      type="button"
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      style={{
        boxShadow: darkModeStatus ? "rgba(255, 255, 255, 0.25) 0px 1px 2px" : "0px 1px 2px rgba(0, 0, 0, 0.25)",
        background: choice === "Confirm" ? "var(--primary-background)" : "transparent"
      }}
      onClick={async () => {
        if (neverShowAgain) {
          const actionChange = { ...displayModal[actionCategory] };
          // @ts-ignore
          actionChange[actionName] = false;
          const newDisplayModal = { ...displayModal };
          // @ts-ignore
          newDisplayModal[actionCategory] = actionChange;
          console.log(newDisplayModal);
          setDisplayModal({ ...newDisplayModal, open: false });
        }
        await handleClick(choice === "Cancel" ? choice : actionName);
      }}
    >{choice}
    </button>
  );
  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      style={{ maxWidth: "410px", width: "calc(100vw - 15px)" }}
      show={displayModal.open}
      onHide={() => { setDisplayModal({ ...displayModal, open: false }); }}
    >
      <Modal.Body>
        <h5>{header}</h5>
        <p>Note: {note}</p>
        <div style={{ display: "flex", gap: "5px" }}>
          <Form.Check
            onChange={() => { setNeverShowAgain(!neverShowAgain); }}
            checked={neverShowAgain}
            name="confirmation"
            className={`default-checkbox${darkModeStatus ? "-dark" : ""}`}
            type="checkbox"
          /> Don&apos;t ask again for this action?
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          { getChoiceButton(getConfirmButtonText()) }
          { getChoiceButton("Cancel") }
        </div>
      </Modal.Body>

    </Modal>
  );
};

export default ConfirmationModal;
