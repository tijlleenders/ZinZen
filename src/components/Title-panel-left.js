import React from 'react'
import Logo from '../images/LogoLight.svg'

const TitlePanelLeft = () => {
  return (
    <div className="left-panel">
      <img src={Logo} alt="ZinZen Logo" className="zinzen-logo" />
      <h4 className="left-panel-font1">a platform for</h4>
      <h4 className="left-panel-font2"><i>self-actualization</i></h4>
      <h4 className="left-panel-font1">and</h4>
      <h4 className="left-panel-font2"><i>collaboration</i></h4>
      <button className="btn-primary-learnmore"><span>Learn More!</span></button>
    </div>
  )
}

export default TitlePanelLeft
