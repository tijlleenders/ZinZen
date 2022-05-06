import React from 'react';
import { Container, Row } from 'react-bootstrap';

import { HeaderDashboard } from './HeaderDashboard';
import { Dashboard } from './Dashboard';

export function Home() {
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
        <Row>
          <Dashboard />
        </Row>
      </Container>
    </div>
  );
}
