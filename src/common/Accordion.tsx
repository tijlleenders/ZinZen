import React from "react";
import { Collapse } from "antd";
import { ZAccordionProps } from "@src/Interfaces/ICommon";

const ZAccordion : React.FC<ZAccordionProps> = ({ panels, style, showCount, defaultActiveKey }) => (
  <Collapse defaultActiveKey={defaultActiveKey} style={style}>
    {panels.map((panel, index) => (
      <Collapse.Panel
        key={`${index + 1}`}
        style={{ flexDirection: "row-reverse" }}
        // @ts-ignore
        header={`${panel.header} ${showCount ? `(${panel.body?.length})` : ""}`}
      > {panel.body}
      </Collapse.Panel>
    ))}
  </Collapse>
);

export default ZAccordion;
