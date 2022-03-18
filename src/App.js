import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Link } from 'react-router-dom';
import LandingPage from './components/landingpage/LandingPage';
import LandingPageThemeChoice from './components/themechoicepage/LandingPageThemeChoice';
import Home from './components/dashboard/Home';
import "@fontsource/montserrat";
import './customize.scss'
import { themeSelectionState } from './store/ThemeSelectionState'
import { languageSelectionState } from './store/LanguageSelectionState'
import { useRecoilState } from 'recoil'
import { darkModeState } from './store/DarkModeState'


function App() {
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const [isThemeChosen, setIsThemeChosen] = useRecoilState(themeSelectionState);
  const [isLanguageChosen, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  return (
    <div className={darkModeStatus ? "App-dark" : "App-light"}>
      <HashRouter>
          {(isLanguageChosen === "No language chosen.") ?
            (<Link to="/ZinZen"><LandingPage /></Link>)
            : (isThemeChosen === "No theme chosen.") ?
            (<Link to="/ZinZen/Theme"><LandingPageThemeChoice /></Link>)
            : (<Link to="/ZinZen/Home"><Home /></Link>)
          }

      </HashRouter>
    </div>
  );
}
export default App;
