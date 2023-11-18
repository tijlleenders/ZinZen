import React from "react";
import { Row, Col } from "antd";
import Icon from "@src/common/Icon";

interface IActionDivProps {
  label: string;
  icon: string;
}

const ActionDiv: React.FC<IActionDivProps> = ({ icon, label }) => {
  return (
    <>
      <Row justify="center">
        <Col>
          <Icon active title={icon} />
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <p>{label}</p>
        </Col>
      </Row>
    </>
  );
};

export default ActionDiv;
