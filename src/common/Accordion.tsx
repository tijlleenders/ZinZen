import React from "react";
import { Collapse } from "antd";

export interface ZAccordionProps {
  panels: { header: string, body: string }[]
  showCount: boolean
}
const ZAccordion : React.FC<ZAccordionProps> = ({ panels, showCount }) => {
  const totalItems = panels.length;
  return (
    <Collapse style={{ background: "var(--secondary-background)" }}>
      {panels.map((panel) => (
        <Collapse.Panel
          style={{ flexDirection: "row-reverse" }}
          header={`${panel.header} ${showCount ? `(${totalItems})` : ""}`}
          key={panel.header}
        > <p style={{ textAlign: "left", fontWeight: 500 }}>{panel.body}</p>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default ZAccordion;
