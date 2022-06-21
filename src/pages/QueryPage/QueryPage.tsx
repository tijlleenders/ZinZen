import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { QueryPageUserChoicePanel } from "@components/QueryPageUserChoicePanel/QueryPageUserChoicePanel";

export const QueryPage = () => (
  <Container fluid>
    <Row>
       <MainHeaderDashboard />
    </Row>
    <Row>
      <Col sm={1} />
      <Col sm>
        <QueryPageUserChoicePanel />
      </Col>
      <Col sm={1} />
    </Row>
  </Container>
);
