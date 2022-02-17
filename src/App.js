import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRecoilState } from 'recoil'
import { Container, Row } from 'react-bootstrap'
import Header from './components/Header';
import Mainbody from './components/Main-body';
import HeaderDashboard from './components/HeaderDashboard';
import Dashboard from './components/Dashboard';
import "@fontsource/montserrat";
import './customize.scss'
import { themeSelectionState } from './store/ThemeSelectionState'
import { languageSelectionState } from './store/LanguageSelectionState'

function App() {
    const [isThemeChosen, setIsThemeChosen] = useRecoilState(themeSelectionState);
    const [isLanguageChosen, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  return (
    <div className="App">
      {(isThemeChosen==="No theme chosen.") ?
      (<div>
      <Container fluid >
        <Row >
          <Header />
        </Row>
        <Row >
          <Mainbody />
        </Row>
      </Container>
      </div>) :
      (<div>
        <Container fluid >
        <Row >
          <HeaderDashboard />
        </Row>
        <Row >
          <Dashboard />
        </Row>
      </Container>
      </div>)}
    </div>);
}
export default App;
