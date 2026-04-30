import React from 'react';
import './Avatar.css';

const Avatar = ({ size = 40, color, className = '', children, src, alt }) => {
  if (src) {
    return (
      <img
        className={`m3-avatar m3-avatar--img ${className}`}
        style={{ width: size, height: size }}
        src={src}
        alt={alt || ''}
      />
    );
  }
  return (
    <span
      className={`m3-avatar ${className}`}
      style={{ width: size, height: size, background: color }}
    >
      {children}
    </span>
  );
};

export default Avatar;
