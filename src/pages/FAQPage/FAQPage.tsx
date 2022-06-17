import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { HeaderFAQPage } from "@components/FAQPageUserPanel/HeaderFAQPage";
import { FAQPageUserPanel } from "@components/FAQPageUserPanel/FAQPageUserPanel";

export const FAQPage = () => (
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
);
