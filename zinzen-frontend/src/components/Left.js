import React from 'react'
import { Button } from 'react-bootstrap'

import "@fontsource/kristi";

const Left = () => {
  return (
    <div className="left-panel">
      <br />
      <br />
      <h1 className="zinzen-text">ZinZen</h1>
      <h4 className="left-panel-font1">a platform for</h4>
      <h4 className="left-panel-font2"><i>self-actualization</i></h4>
      <h4 className="left-panel-font1">and</h4>
      <h4 className="left-panel-font2"><i>collaboration</i></h4>
      <br />
      <Button href="#" className="btn-primary">Learn More!</Button>
    </div>

  )
}

export default Left
