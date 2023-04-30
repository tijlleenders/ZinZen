/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ISubHeaderProps } from "@src/Interfaces/ICommon";

const NavBtn = ({ className, handleClick } : { className: string, handleClick: () => void }) => (
  <button type="button" onClick={handleClick} style={{ background: "transparent", border: "none", flex: 1 }}>
    <img src={chevronLeftIcon} className={className} />
  </button>
);

const SubHeader: React.FC<ISubHeaderProps> = ({ leftNav, rightNav, title }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
    <NavBtn className="chevronLeft" handleClick={leftNav} />
    <p style={{ padding: "15px 0", margin: "0px 15px", flex: 2 }} className="subheader-title">
      <span
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
      >
        {title}
      </span>
    </p>
    <NavBtn className="chevronRight" handleClick={rightNav} />
  </div>

);

export default SubHeader;
