import React from 'react';
import './Card.css';

const Card = React.forwardRef(function Card(
  { variant = 'filled', interactive, className = '', children, as, ...rest },
  ref
) {
  const Tag = as || 'div';
  const cls = [
    'm3-card',
    `m3-card--${variant}`,
    interactive ? 'm3-card--interactive' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={cls} {...rest}>
      {interactive && <span className="m3-card__state" aria-hidden="true" />}
      {children}
    </Tag>
  );
});

export default Card;
