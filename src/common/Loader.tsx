import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = () => (

  <Spinner
    style={{
      position: "absolute",
      top: "18px",
      left: "18px",
      width: "50px",
      height: "50px",
      color: "#CD6E51"
    }}
    animation="border"
    role="status"
  >

    <span className="visually-hidden">Loading...</span>
  </Spinner>

);

export default Loader;
