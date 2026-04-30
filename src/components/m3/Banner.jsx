import React from 'react';
import './Banner.css';

const Banner = ({ severity = 'info', children, className = '' }) => (
  <div role="alert" className={`m3-banner m3-banner--${severity} ${className}`}>
    <span className="m3-banner__content">{children}</span>
  </div>
);

export default Banner;
