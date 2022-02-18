import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, Row, Col } from 'react-bootstrap'
const UserChoiceDashboard = () => {
  return (
    <div>
      <Container fluid>
        <Row >
          <Button variant="peach" size="lg" className="dashboard-choice-btn1">My Goals</Button>
        </Row>
        <Row >
          <Button variant="dark-pink" size="lg" className="dashboard-choice-btn">My Feelings</Button>
        </Row>
        <Row >
          <Button variant="grey-base" size="lg" className="dashboard-choice-btn">My Time</Button>
        </Row>
        <Row >
          <Button variant="pale-blue" size="lg" className="dashboard-choice-btn">Explore</Button>
        </Row>
        <Row >
          <Button variant="purple" size="lg" className="dashboard-choice-btn">ZinZen</Button>
        </Row>
      </Container>
    </div>
  )
}

export default UserChoiceDashboard
