import React from 'react'
import { useRecoilState } from 'recoil'
import { Button } from 'react-bootstrap';
import ThemeDark from '../../images/DashboardThemeDark.svg'
import ThemeLight from '../../images/DashboardThemeLight.svg'
import { themeSelectionState } from '../../store/ThemeSelectionState'
import { useNavigate } from "react-router-dom";
const ThemesChoice = () => {
    const [isThemeChosen, setIsThemeChosen] = useRecoilState(themeSelectionState);
    const navigate = useNavigate();
    return (
        <div className="themerow">
            <Button variant="primary" size="lg" className="theme-choice-btn"  onClick={() => { setIsThemeChosen(true);
                                                                                               localStorage.setItem("theme", "light");
                                                                                               navigate('/ZinZen/home');
                                                                                               window.location.reload(false);
                                                                                               
                                                                                       }}>
            <img src={ThemeLight} alt="Light Theme" className="themechoice" />
            </Button>
            <br />
            <br />
            <Button variant="primary" size="lg" className="theme-choice-btn"  onClick={() => { setIsThemeChosen(true);
                                                                                               localStorage.setItem("theme", "dark");
                                                                                               navigate('/ZinZen/home');
                                                                                               window.location.reload(false);
                                                                                       }}>
            <img src={ThemeDark} alt="Dark Theme" className="themechoice" />
            </Button>
        </div>
    )
}

export default ThemesChoice