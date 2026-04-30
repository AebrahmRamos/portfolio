import React from 'react';
import './Chip.css';

const Chip = React.forwardRef(function Chip(
  {
    variant = 'assist',
    label,
    selected,
    onClick,
    onDelete,
    className = '',
    leadingIcon,
    children,
    ...rest
  },
  ref
) {
  const cls = [
    'm3-chip',
    `m3-chip--${variant}`,
    selected ? 'm3-chip--selected' : '',
    onClick ? 'm3-chip--interactive' : '',
    className,
  ].filter(Boolean).join(' ');

  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag ref={ref} className={cls} onClick={onClick} type={onClick ? 'button' : undefined} {...rest}>
      {(onClick || onDelete) && <span className="m3-chip__state" aria-hidden="true" />}
      {leadingIcon && <span className="m3-chip__leading">{leadingIcon}</span>}
      <span className="m3-chip__label">{label ?? children}</span>
      {onDelete && (
        <button
          type="button"
          className="m3-chip__delete"
          onClick={(e) => { e.stopPropagation(); onDelete(e); }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </Tag>
  );
});

export default Chip;
