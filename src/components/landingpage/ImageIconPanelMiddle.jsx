import React from "react";

import BookIcon from "../../images/bookicon.svg";
import "./landingpage.scss"

export const ImageIconPanelMiddle = () => {
    return (
        <div>
            <img src={BookIcon} alt="Book Icon" className="book-icon-landing-page" />
        </div>
    );
};
