import { confirmationHeaders } from "@src/constants/confirmationHeaders";
import { ConfirmationModalProps } from "@src/Interfaces/IPopupModals";
import { darkModeState, showConfirmation } from "@src/store";
import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ action, handleClick }) => {
  const { actionCategory, actionName } = action;
  const darkModeStatus = useRecoilValue(darkModeState);
  const [neverShowAgain, setNeverShowAgain] = useState(false);
  const [displayModal, setDisplayModal] = useRecoilState(showConfirmation);
  // @ts-ignore
  const { header, note } = confirmationHeaders[actionCategory][actionName];
  const getChoiceButton = (choice: string) => (
    <button
      type="button"
      style={choice === "Cancel" ? { backgroundColor: "rgba(115, 115, 115, 0.6)" } : {}}
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
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
      className={`popupModal${darkModeStatus ? "-dark" : ""}`}
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
          { getChoiceButton("Confirm") }
          { getChoiceButton("Cancel") }
        </div>
      </Modal.Body>

    </Modal>
  );
};

export default ConfirmationModal;
