import React from "react";
import { Spin } from "antd";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";

const Loader = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Spin
      className="loader"
      style={{ color: darkModeStatus ? "#705BBC" : "#CD6E51" }}
    />
  );
};

export default Loader;
