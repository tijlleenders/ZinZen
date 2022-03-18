import React from 'react'
import Header from '../dashboard/HeaderDashboard'
import { Container, Row, Col } from 'react-bootstrap'

const MyFeelings = () => {
  return (
    <div>
      <Container fluid >
                <Row >
                    <Header />
                </Row>
                <Row >
                  <Col sm={1}></Col>
                    <Col >
                    <h3 className="my-feelings-font">ababaa</h3>
                        <MyFeelingChoices />
                    </Col>
                    <Col sm={1}></Col>
                </Row>
            </Container>
    </div>
  )
}

export default MyFeelings
