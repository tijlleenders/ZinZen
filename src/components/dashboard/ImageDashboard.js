import React from "react";

import BookIcon from "../../images/bookicon.svg";
import "./dashboard.scss"

export const ImageDashboard = () => {
    return (
        <div>
            <img
                src={BookIcon}
                alt="Book Icon"
                className="book-icon-dashboard"
            />
        </div>
    );
};
