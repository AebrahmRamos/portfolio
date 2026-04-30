import React from 'react';
import './Fab.css';

const Fab = React.forwardRef(function Fab(
  { variant = 'primary', size = 'medium', extended, className = '', children, ...rest },
  ref
) {
  const cls = [
    'm3-fab',
    `m3-fab--${variant}`,
    `m3-fab--${size}`,
    extended ? 'm3-fab--extended' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <button ref={ref} className={cls} {...rest}>
      <span className="m3-fab__state" aria-hidden="true" />
      <span className="m3-fab__content">{children}</span>
    </button>
  );
});

export default Fab;
