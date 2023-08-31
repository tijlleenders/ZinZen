import React from "react";
import { Row, Col } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

interface IActionDivProps {
  label: string;
  icon: string;
}

const ActionDiv: React.FC<IActionDivProps> = ({ icon, label }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Row>
      <Col span={6}>
        <img
          alt="delete goal"
          src={icon}
          className={`${darkModeStatus ? "dark-svg" : ""}`}
          style={{ cursor: "pointer" }}
        />
      </Col>
      <Col span={18}>
        <p>{label}</p>
      </Col>
    </Row>
  );
};

export default ActionDiv;
