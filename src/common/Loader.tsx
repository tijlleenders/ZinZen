import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { displayLoader } from "@src/store";

const Loader = () => {
  const showLoader = useRecoilValue(displayLoader);
  return (
    <Modal
      show={showLoader}
    >
      <Modal.Body style={{
        background: "transparent",
        color: "white",
        position: "absolute",
        width: "100%",
        textAlign: "center"
      }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Modal.Body>
    </Modal>

  );
};

export default Loader;
