import React from "react";

import ZinZen from "../../images/LogoTextLight.svg";
import Logo from "../../images/zinzenlogo.png";

export const TitlePanelLeft = () => {
    return (
        <div className="left-panel">
            <img src={Logo} alt="ZinZen Logo" className="zinzen-logo" />
            <img
                src={ZinZen}
                alt="ZinZen Text Logo"
                className="zinzen-text-logo"
            />
            <h4 className="left-panel-font1">Realize dreams</h4>
            <h4 className="left-panel-font2">
                <i>together</i>
            </h4>
            <button className="btn-primary-learnmore">
                <span>Learn More!</span>
            </button>
        </div>
    );
};
