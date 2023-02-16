import { darkModeState } from "@src/store";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { useRecoilValue } from "recoil";

const Loader = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Spinner
      className="loader"
      animation="border"
      role="status"
      style={{ color: darkModeStatus ? "#705BBC" : "#CD6E51" }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>

  );
};

export default Loader;
