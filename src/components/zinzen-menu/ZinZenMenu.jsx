import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { HeaderDashboard } from '../dashboard/HeaderDashboard';
import { UserChoiceZinZenMenu } from './UserChoiceZinZenMenu';

export function ZinZenMenu() {
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
        <Row>
          <Col sm={2} />
          <Col>
            <UserChoiceZinZenMenu />
          </Col>
          <Col sm={2} />
        </Row>
      </Container>
    </div>
  );
}
