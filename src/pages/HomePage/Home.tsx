import React from 'react';
import { Container, Row } from 'react-bootstrap';

import { HeaderDashboard } from '@components/dashboard/HeaderDashboard';
import { Dashboard } from '@components/dashboard/Dashboard';

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
