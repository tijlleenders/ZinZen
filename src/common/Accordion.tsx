import React, { ReactNode, useState } from "react";
import { Collapse } from "antd";

export interface ZAccordionProps {
  style: React.CSSProperties | undefined,
  panels: { header: string, body: ReactNode | ReactNode[] }[]
  showCount: boolean
}
const ZAccordion : React.FC<ZAccordionProps> = ({ panels, style, showCount }) => (
  <Collapse style={style}>
    {panels.map((panel) => (
      <Collapse.Panel
        style={{ flexDirection: "row-reverse" }}
        // @ts-ignore
        header={`${panel.header} ${showCount ? `(${panel.body?.length})` : ""}`}
        key={panel.header}
      > {panel.body}
      </Collapse.Panel>
    ))}
  </Collapse>
);

export default ZAccordion;
