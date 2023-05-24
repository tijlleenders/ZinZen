import { Collapse } from "antd";
import { useRecoilValue } from "recoil";
import React, { ReactNode } from "react";

import { darkModeState } from "@src/store";

const commonStyle : React.CSSProperties = {
  margin: 0,
  fontWeight: "bolder",
  fontSize: "1.143em",
  color: "black",
  textAlign: "left",
};
const darkCommonStyle = {
  color: "white",
};

export interface ArchivedAccordionProps {
  totalItems: number,
  children: ReactNode,
  name: string
}
const ArchivedAccordion: React.FC<ArchivedAccordionProps> = ({ name, totalItems, children }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Collapse className={`${name}-accordion Accordion${darkModeStatus ? "-dark" : ""}`} style={{ margin: "1.5em 0" }}>
      <Collapse.Panel
        key="0"
        header={(
          <p style={{
            ...commonStyle,
            ...(darkModeStatus ? darkCommonStyle : {}) }}
          > {`${name} (${totalItems})`}
          </p>
      )}
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  );
};

export default ArchivedAccordion;
