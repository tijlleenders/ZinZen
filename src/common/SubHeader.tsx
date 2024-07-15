/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Col, Row } from "antd";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ISubHeaderProps } from "@src/Interfaces/ICommon";

const NavBtn = ({ show, className, handleClick }: { show?: boolean; className: string; handleClick?: () => void }) => (
  <Col span={6} style={{ textAlign: "center", alignSelf: "center" }}>
    {show && (
      <button type="button" className="ordinary-element" onClick={handleClick}>
        <img src={chevronLeftIcon} className={className} />
      </button>
    )}
  </Col>
);

const SubHeader: React.FC<ISubHeaderProps> = ({ leftNav, rightNav, title, showLeftNav, showRightNav }) => (
  <Row className="subheader">
    <NavBtn show={showLeftNav} className="chevronLeft theme-icon" handleClick={leftNav} />
    <Col span={12}>
      <p style={{ padding: "15px 0", margin: "0px 15px" }} className="subheader-title">
        <span role="button" tabIndex={0} style={{ cursor: "pointer" }}>
          {" "}
          {title}
        </span>
      </p>
    </Col>
    <NavBtn show={showRightNav} className="chevronRight theme-icon" handleClick={rightNav} />
  </Row>
);

export default SubHeader;
