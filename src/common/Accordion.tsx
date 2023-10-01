/* eslint-disable react/no-unstable-nested-components */
import React from "react";
import { Collapse } from "antd";
import { ZAccordionProps } from "@src/Interfaces/ICommon";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

const ZAccordion: React.FC<ZAccordionProps> = ({ panels, style, showCount, defaultActiveKey }) => (
  <Collapse
    expandIcon={({ isActive }) => (
      <img
        alt="zinzen about"
        className={`${isActive ? "chevronDown" : "chevronRight"} theme-icon`}
        src={chevronLeftIcon}
      />
    )}
    defaultActiveKey={defaultActiveKey}
    style={style}
    accordion
  >
    {panels.map((panel, index) => (
      <Collapse.Panel
        key={`${index + 1}`}
        style={{ flexDirection: "row-reverse" }}
        // @ts-ignore
        header={`${panel.header} ${showCount ? `(${panel.body?.length})` : ""}`}
      >
        {" "}
        {panel.body}
      </Collapse.Panel>
    ))}
  </Collapse>
);

export default ZAccordion;
