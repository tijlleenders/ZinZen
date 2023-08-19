import React from "react";
import { Col, Row } from "antd";

interface IConfigOptionProps {
  label: string | React.ReactNode;
  children: React.ReactNode;
}

const ConfigOption: React.FC<IConfigOptionProps> = ({ label, children }) => {
  return (
    <Row>
      <Col className="gutter-row" span={4} style={{ fontWeight: 500 }}>
        {typeof label === "string" ? <div>{label}</div> : label}
      </Col>
      <Col className="gutter-row" span={19}>
        <div
          style={{
            display: "flex",
            gap: 6,
            height: "100%",
            alignItems: "center",
          }}
        >
          {children}
        </div>
      </Col>
    </Row>
  );
};

export default ConfigOption;
