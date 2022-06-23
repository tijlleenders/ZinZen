import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { DashboardImagePanel } from "@components/DasboardImagePanel/DashboardImagePanel";
import { DashboardUserChoicePanel } from "@components/DashboardUserChoicePanel/DashboardUserChoicePanel";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

export const Dashboard = () => (
  <div>
    <Row>
      <MainHeaderDashboard />
    </Row>
    <Container fluid>
      <Row>
        <Col sm={2} />
        <Col sm={3}>
          <DashboardImagePanel />
        </Col>
        <Col sm={1} />
        <Col sm>
          <DashboardUserChoicePanel />
        </Col>
        <Col sm={2} />
      </Row>
    </Container>
  </div>
);
