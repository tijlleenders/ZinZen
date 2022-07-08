import { Container, Col } from "react-bootstrap";


export const Dashboard = () => (
  <div>
    <Row>
      <MainHeaderDashboard />
    </Row>
    <Container fluid>
      <Row>
        <Col sm={2} />
        <Col sm={3}>
          <DashboardImagePanel />
        </Col>
        <Col sm={1} />
        <Col sm>
          <DashboardUserChoicePanel />
        </Col>
        <Col sm={2} />
      </Row>
    </Container>
  </div>
);
