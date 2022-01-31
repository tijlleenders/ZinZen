import React from 'react'
import ThemeLight from '../images/DashboardThemeLight.svg'
import ThemeDark from '../images/DashboardThemeDark.svg'

const Themes = () => {
  return (
    <div>
      <button className="theme-btn1"><img src={ThemeLight} alt="Light Theme" className="themechoice"/></button>
      <br/>
      <br/>
      <button className="theme-btn2"><img src={ThemeDark} alt="Dark Theme" className="themechoice"/></button>
    </div>
  )
}

export default Themes
