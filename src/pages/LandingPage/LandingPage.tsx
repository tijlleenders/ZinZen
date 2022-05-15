import React from 'react';
import { Container, Row } from 'react-bootstrap';

import { Header } from '@components/landingpage/Header';
import { Mainbody } from '@components/landingpage/Main-body';

export function LandingPage() {
  return (
    <div>
      <div>
        <Container fluid>
          <Row>
            <Header />
          </Row>
          <Row>
            <Mainbody />
          </Row>
        </Container>
      </div>
    </div>
  );
  
}
