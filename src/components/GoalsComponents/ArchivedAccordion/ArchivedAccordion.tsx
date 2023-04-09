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
  totalItems: number,
  children: ReactNode,
  name: string
}
const ArchivedAccordion: React.FC<ArchivedAccordionProps> = ({ name, totalItems, children }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Accordion id={`${name}-accordion`} className={`Accordion${darkModeStatus ? "-dark" : ""}`} style={{ margin: "1.5em 0" }}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <p style={{
            ...commonStyle,
            ...(darkModeStatus ? darkCommonStyle : {}) }}
          > {`${name} (${totalItems})`}
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
