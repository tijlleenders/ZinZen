import React from 'react'
import HeaderDashboard from './HeaderDashboard'
import Dashboard from './Dashboard'
import { Container, Row } from 'react-bootstrap'

const Home = () => {
  return (
    <div>
        <Container fluid >
        <Row >
          <HeaderDashboard />
        </Row>
        <Row >
          <Dashboard />
        </Row>
      </Container>
    </div>
  )
}

export default Home
