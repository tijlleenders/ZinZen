import React from "react";
import { Row, Col } from "antd";
import Icon from "@src/common/Icon";

interface IActionDivProps {
  label: string;
  icon: string;
}

const ActionDiv: React.FC<IActionDivProps> = ({ icon, label }) => {
  return (
    <Row>
      <Col span={6}>
        <Icon active title={icon} />
      </Col>
      <Col span={18}>
        <p>{label}</p>
      </Col>
    </Row>
  );
};

export default ActionDiv;
