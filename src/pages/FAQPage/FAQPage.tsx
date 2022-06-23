import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { HeaderFAQPage } from "@components/FAQPageUserPanel/HeaderFAQPage";
import { FAQPageUserPanel } from "@components/FAQPageUserPanel/FAQPageUserPanel";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

export const FAQPage = () => (
  <div>
    <Container fluid>
      <Row>
        <MainHeaderDashboard />
      </Row>
    </Container>
    <Container fluid>
      <Row>
        <HeaderFAQPage />
      </Row>
      <Row>
        <Col sm={1} />
        <Col sm>
          <FAQPageUserPanel />
        </Col>
        <Col sm={1} />
      </Row>
    </Container>
  </div>
);
