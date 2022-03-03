import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home1 from './components/Home1';
import Home from './components/Home';
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
      <BrowserRouter>
        <Routes>
          {(isThemeChosen === "No theme chosen.") ?
            (<Route path="/ZinZen" element={<Home1 />} />)
            :
            (<Route path="/ZinZen/home" element={<Home />} />)
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
