import React from "react";
import { Container, Row } from "react-bootstrap";

import { Dashboard } from "@pages/Dashboard/Dashboard";

export const HomePage = () => (
  <Container fluid>
    <Row>
      <Dashboard />
    </Row>
  </Container>
);
