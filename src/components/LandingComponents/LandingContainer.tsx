import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { LandingLeftPanel } from './LandingLeftPanel';
import { LandingMiddlePanel } from './LandingMiddlePanel';
import { LandingRightPanel } from './LandingRightPanel';

export const LandingContainer = () => (
  <div className="h-100 d-inline-block">
    <Container fluid>
      <Row>
        <Col sm={1} />
        <Col sm>
          <LandingLeftPanel />
        </Col>
        <Col sm>
          <LandingMiddlePanel />
        </Col>
        <Col sm>
          <LandingRightPanel />
        </Col>
        <Col sm={1} />
      </Row>
    </Container>
  </div>
);
