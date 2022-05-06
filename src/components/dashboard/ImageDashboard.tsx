import React from 'react';

import BookIcon from '@assets/images/bookicon.svg';
import './dashboard.scss';

export function ImageDashboard() {
  return (
    <div>
      <img
        src={BookIcon}
        alt="Book Icon"
        className="book-icon-dashboard"
      />
    </div>
  );
}
