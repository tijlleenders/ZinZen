import React from 'react';

import BookIcon from '@assets/images/bookicon.svg';
import './landingpage.scss';

export function ImageIconPanelMiddle() {
  return (
    <div>
      <img src={BookIcon} alt="Book Icon" className="book-icon-landing-page" />
    </div>
  );
}
