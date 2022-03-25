import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { darkModeState } from "./store/DarkModeState";
import { themeSelectionState } from "./store/ThemeSelectionState";
import { languageSelectionState } from "./store/LanguageSelectionState";

import { LandingPage } from "./components/landingpage/LandingPage";
import { LandingPageThemeChoice } from "./components/themechoicepage/LandingPageThemeChoice";
import { MyFeelings } from "./components/myfeelingspage/MyFeelings";
import { Home } from "./components/dashboard/Home";

import "./customize.scss";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/montserrat";

export const App = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    const isThemeChosen = useRecoilValue(themeSelectionState);
    const isLanguageChosen = useRecoilValue(languageSelectionState);
    return (
        <div className={darkModeStatus ? "App-dark" : "App-light"}>
            <BrowserRouter>
                <Routes>
                    {isLanguageChosen === "No language chosen." ? (
                        <Route path="/ZinZen" element={<LandingPage />} />
                    ) : isThemeChosen === "No theme chosen." ? (
                        <Route
                            path="/ZinZen/Theme"
                            element={<LandingPageThemeChoice />}
                        />
                    ) : (
                        <Route path="/ZinZen/Home" element={<Home />} />
                    )}
                    <Route
                        path="/ZinZen/Home/MyFeelings"
                        element={<MyFeelings />}
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
};
