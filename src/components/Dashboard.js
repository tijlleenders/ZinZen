import React from 'react'
import ImageDashboard from './ImageDashboard'
import UserChoiceDashboard from './UserChoiceDashboard'
import { Container, Row, Col } from 'react-bootstrap'


const Dashboard = () => {

  return (
    <div>
      <Container fluid>
        <Row >
          <Col sm={2}></Col>
          <Col sm={3}><ImageDashboard /></Col>
          <Col sm={1}></Col>
          <Col sm><UserChoiceDashboard /></Col>
          <Col sm={2}></Col>
        </Row>
      </Container>

    </div>
  )
}

export default Dashboard
