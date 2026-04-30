import React from 'react';
import './IconButton.css';

const IconButton = React.forwardRef(function IconButton(
  { variant = 'standard', className = '', children, ...rest },
  ref
) {
  const cls = ['m3-icon-btn', `m3-icon-btn--${variant}`, className].filter(Boolean).join(' ');
  return (
    <button ref={ref} className={cls} {...rest}>
      <span className="m3-icon-btn__state" aria-hidden="true" />
      <span className="m3-icon-btn__icon">{children}</span>
    </button>
  );
});

export default IconButton;
