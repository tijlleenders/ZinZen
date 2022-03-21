import React from 'react'
import Header from '../dashboard/HeaderDashboard'
import MyFeelingsChoices from './MyFeelingsChoices'
import { Container, Row, Col } from 'react-bootstrap'

const MyFeelings = () => {
  return (
    <div>
      <Container fluid >
                <Row >
                    <Header />
                </Row>
                <Row >
                    <Col >
                    <h3 className="my-feelings-font">Hi! How do you feel today?</h3>
                    <MyFeelingsChoices />
                    </Col>
                    <Col sm={1}></Col>
                </Row>
            </Container>
    </div>
  )
}

export default MyFeelings
