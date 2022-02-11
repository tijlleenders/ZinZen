import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import Header from './components/Header';
import Mainbody from './components/Main-body';
import "@fontsource/montserrat";
import './customize.scss'

function App() {
  return (
    <div className="App">
      <Container fluid >
        <Row >
          <Header />
        </Row>
        <Row >
          <Mainbody />
        </Row>
      </Container>
    </div>
  );
}

export default App;
