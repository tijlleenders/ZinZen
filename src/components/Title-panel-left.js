import React from 'react'
import ZinZen from '../images/LogoLight.svg'
import Logo from '../images/zinzenlogo.png'

const TitlePanelLeft = () => {
  return (
    <div className="left-panel">
      <img src={Logo} alt="ZinZen Logo" className="zinzen-logo" />
      <img src={ZinZen} alt="ZinZen Text Logo" className="zinzen-text-logo" />
      <h4 className="left-panel-font1">a platform for</h4>
      <h4 className="left-panel-font2"><i>self-actualization</i></h4>
      <h4 className="left-panel-font1">and</h4>
      <h4 className="left-panel-font2"><i>collaboration</i></h4>
      <button className="btn-primary-learnmore"><span>Learn More!</span></button>
    </div>
  )
}

export default TitlePanelLeft
