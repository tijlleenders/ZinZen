import React from "react";
import { Row, Col } from "antd";
import Icon from "@src/common/Icon";

interface IActionDivProps {
  label: string;
  icon: React.ReactNode;
  dataTestId?: string;
}

const ActionDiv: React.FC<IActionDivProps> = ({ icon, label, dataTestId }) => {
  return (
    <>
      <Row justify="center">
        <Col>{typeof icon === "string" ? <Icon active title={icon} /> : icon}</Col>
      </Row>
      <Row justify="center">
        <Col>
          <p data-testid={dataTestId}>{label}</p>
        </Col>
      </Row>
    </>
  );
};

export default ActionDiv;
