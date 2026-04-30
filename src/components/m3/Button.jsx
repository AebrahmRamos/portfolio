import React from 'react';
import './Button.css';

const Button = React.forwardRef(function Button(
  {
    variant = 'filled',
    size = 'medium',
    startIcon,
    endIcon,
    fullWidth,
    className = '',
    children,
    disabled,
    href,
    ...rest
  },
  ref
) {
  const Tag = href ? 'a' : 'button';
  const cls = [
    'm3-btn',
    `m3-btn--${variant}`,
    `m3-btn--${size}`,
    fullWidth ? 'm3-btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      ref={ref}
      className={cls}
      disabled={disabled}
      href={href}
      {...rest}
    >
      <span className="m3-btn__state" aria-hidden="true" />
      {startIcon && <span className="m3-btn__icon">{startIcon}</span>}
      <span className="m3-btn__label">{children}</span>
      {endIcon && <span className="m3-btn__icon">{endIcon}</span>}
    </Tag>
  );
});

export default Button;
