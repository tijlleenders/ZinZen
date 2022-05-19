import React from 'react';

import './ToggleSwitch.scss';

export const ToggleSwitch = ({ label } : { label : string }) => (
  <div className="container">
    {label}
    {' '}
    <div className="toggle-switch">
      <input
        type="checkbox"
        className="checkbox"
        name={label}
        id={label}
      />
      <label className="label" htmlFor={label}>
        <span className="inner" />
        <span className="switch" />
      </label>
    </div>
  </div>
);
