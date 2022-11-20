import React, { useState } from "react";
import { useNavigate } from "react-router";

import { acceptRelationship, addContact } from "@src/api/ContactsAPI";
import { queryStyle } from "@src/constants/booleanScreen";
import { darkModeState } from "@src/store";
import { Modal, Button } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";

const InvitePage = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [newContactName, setNewContactName] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const handleCloseAddContact = () => setShowAddContactModal(false);
  const handleShowAddContact = () => setShowAddContactModal(true);
  return (
    <>
      <div style={{ ...queryStyle.main }}>
        <LandingHeader avatar={null}/>
        <p style={{ paddingTop: "100px", margin: 0 }}>
          You have been invited.
          <br />
          Would you like to accept the invite?
        </p>
        <button
          type="button"
          style={queryStyle.question}
          onClick={handleShowAddContact}
        > Yes
        </button>
        <button
          type="button"
          style={queryStyle.question}
          onClick={() => { navigate("/"); }}
        > No
        </button>
      </div>
      <Modal
        id="addContact-modal"
        show={showAddContactModal}
        onHide={handleCloseAddContact}
        centered
        autoFocus={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className={darkModeStatus ? "note-modal-title-dark" : "note-modal-title-light"}>
            Name the person you got this link from
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="text"
            placeholder="Name"
            className="show-feelings__note-input"
            value={newContactName}
            onChange={(e) => {
              setNewContactName(e.target.value);
            }}
              // Admittedly not the best way to do this but suffices for now
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setNewContactName("");
                handleCloseAddContact();
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            type="submit"
            onClick={async () => {
              const res = await acceptRelationship();
              if (res.success) {
                await addContact(newContactName, res.response?.relId);
                setNewContactName("");
                handleCloseAddContact();
                navigate("/");
              }
            }}
            className="addContact-submit-button"
          >Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvitePage;
