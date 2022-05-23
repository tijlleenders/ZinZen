import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { ZinZenMenuList } from '@components/ZinZenMenuList/ZinZenMenuList';

export const ZinZenMenuPage = () => (
  <Container fluid>
    <Row>
      <Col sm={2} />
      <Col>
        <ZinZenMenuList />
      </Col>
      <Col sm={2} />
    </Row>
  </Container>
);
