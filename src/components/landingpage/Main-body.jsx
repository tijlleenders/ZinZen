import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { TitlePanelLeft } from './Title-panel-left';
import { ImageIconPanelMiddle } from './ImageIconPanelMiddle';
import { UserChoicePanelRight } from './UserChoicePanelRight';

export function Mainbody() {
  return (
    <div className="h-100 d-inline-block">
      <Container fluid>
        <Row>
          <Col sm={1} />
          <Col sm>
            <TitlePanelLeft />
          </Col>
          <Col sm>
            <ImageIconPanelMiddle />
          </Col>
          <Col sm>
            <UserChoicePanelRight />
          </Col>
          <Col sm={1} />
        </Row>
      </Container>
    </div>
  );
}
