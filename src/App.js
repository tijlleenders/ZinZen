import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
      <BrowserRouter basename="ZinZen" >
        <Routes>
          {(isLanguageChosen === "No language chosen.") ?
            (<Route path="/ZinZen" element={<LandingPage />} />)
            : (isThemeChosen === "No theme chosen.") ?
            (<Route path="/ZinZen/Theme" element={<LandingPageThemeChoice />} />)
            : (<Route path="/ZinZen/Home" element={<Home />} />)
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
