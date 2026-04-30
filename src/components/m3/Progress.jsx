import React from 'react';
import './Progress.css';

const Progress = ({ size = 40, className = '' }) => (
  <span
    className={`m3-progress ${className}`}
    role="progressbar"
    aria-label="Loading"
    style={{ width: size, height: size }}
  >
    <span className="m3-progress__spinner" />
  </span>
);

export default Progress;
