import { Checkbox, Modal } from "antd";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { themeState } from "@src/store/ThemeState";
import { darkModeState, showConfirmation } from "@src/store";
import { getConfirmButtonText } from "@src/constants/myGoals";
import { ConfirmationModalProps } from "@src/Interfaces/IPopupModals";
import { confirmationHeaders } from "@src/constants/confirmationHeaders";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ action, handleClick }) => {
  const { actionCategory, actionName } = action;
  const darkModeStatus = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeState);

  const [neverShowAgain, setNeverShowAgain] = useState(false);
  const [displayModal, setDisplayModal] = useRecoilState(showConfirmation);
  // @ts-ignore
  const { header, note } = confirmationHeaders[actionCategory][actionName];
  const getChoiceButton = (choice: string) => (
    <button
      type="button"
      className={`default-btn${darkModeStatus ? "-dark" : ""}`}
      style={{
        boxShadow: darkModeStatus ? "rgba(255, 255, 255, 0.25) 0px 1px 2px" : "0px 1px 2px rgba(0, 0, 0, 0.25)",
        background: choice !== "Cancel" ? "var(--primary-background)" : "transparent"
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
      open={displayModal.open}
      closable={false}
      footer={null}
      centered
      onCancel={() => { setDisplayModal({ ...displayModal, open: false }); }}
      className={`popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <h5>{header}</h5>
      <p>Note: {note}</p>
      <div style={{ display: "flex", gap: "5px" }}>
        <Checkbox
          checked={neverShowAgain}
          className="checkbox"
          onChange={() => { setNeverShowAgain(!neverShowAgain); }}
        > Don&apos;t ask again for this action?
        </Checkbox>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        { getChoiceButton(getConfirmButtonText(actionName)) }
        { getChoiceButton("Cancel") }
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
