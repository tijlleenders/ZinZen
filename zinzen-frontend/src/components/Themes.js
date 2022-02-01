import React from 'react'
import { Button } from 'react-bootstrap';
import ThemeDark from '../images/DashboardThemeDark.svg'
import ThemeLight from '../images/DashboardThemeLight.svg'
const Themes = () => {
    return (
        <div>
            <Button variant="primary" size="lg" className="theme-choice-btn">
            <img src={ThemeLight} alt="Light Theme" className="themechoice" />
            </Button>
            <br />
            <br />
            <Button variant="primary" size="lg" className="theme-choice-btn">
            <img src={ThemeDark} alt="Dark Theme" className="themechoice" />
            </Button>
        </div>
    )
}

export default Themes