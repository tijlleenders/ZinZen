import React from 'react'
import { themeSelectionState } from '../store/ThemeSelectionState'
import { useRecoilState } from 'recoil'
import { Button } from 'react-bootstrap';
import ThemeDark from '../images/DashboardThemeDark.svg'
import ThemeLight from '../images/DashboardThemeLight.svg'
import { useNavigate } from "react-router-dom";
const ThemesChoice = () => {
    const [isThemeChosen, setIsThemeChosen] = useRecoilState(themeSelectionState);
    const navigate = useNavigate();
    return (
        <div>
            <Button variant="primary" size="lg" className="theme-choice-btn"  onClick={() => { setIsThemeChosen(true);
                                                                                               localStorage.setItem("theme", "light");
                                                                                               window.location.reload(false);
                                                                                               navigate('/ZinZen/home');

                                                                                       }}>
            <img src={ThemeLight} alt="Light Theme" className="themechoice" />
            </Button>
            <br />
            <br />
            <Button variant="primary" size="lg" className="theme-choice-btn"  onClick={() => { setIsThemeChosen(true);
                                                                                               localStorage.setItem("theme", "dark");
                                                                                               window.location.reload(false);
                                                                                               navigate('/ZinZen/home');
                                                                                       }}>
            <img src={ThemeDark} alt="Dark Theme" className="themechoice" />
            </Button>
        </div>
    )
}

export default ThemesChoice