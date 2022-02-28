import React from 'react'
import { Container, Row } from 'react-bootstrap'
import Header from './Header';
import Mainbody from './Main-body';

const Home1 = () => {
  return (
    <div>
      <div>
      <Container fluid >
        <Row >
          <Header />
        </Row>
        <Row >
          <Mainbody />
        </Row>
      </Container>
      </div>
    </div>
  )
}

export default Home1
