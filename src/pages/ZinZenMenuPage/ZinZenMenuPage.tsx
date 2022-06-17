import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { ZinZenMenuList } from "@components/ZinZenMenuList/ZinZenMenuList";

export const ZinZenMenuPage = () => (
  <div>
    <Container fluid>
      <Row>
        <HeaderDashboard />
      </Row>
    </Container>
    <Container fluid>
      <Row className="position">
        <Col sm={2} />
        <Col>
          <ZinZenMenuList />
        </Col>
        <Col sm={2} />
      </Row>
    </Container>
  </div>
);
