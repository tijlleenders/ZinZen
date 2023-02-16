import React, { ReactNode } from "react";
import { Accordion } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import { darkModeState } from "@src/store";

const commonStyle = {
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
  totalArchived: number,
  children: ReactNode
}
const ArchivedAccordion: React.FC<ArchivedAccordionProps> = ({ totalArchived, children }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Accordion className={`Accordion${darkModeStatus ? "-dark" : ""}`} style={{ margin: "1.5em 0" }}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <p style={{
            ...commonStyle,
            ...(darkModeStatus ? darkCommonStyle : {}) }}
          > {`Archived (${totalArchived})`}
          </p>
        </Accordion.Header>
        <Accordion.Body>
          {children}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default ArchivedAccordion;
