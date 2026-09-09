import React, { useId } from 'react';
import './TextField.css';

// Rewritten from the Material filled field (tonal fill, underline, floating
// label) to a plain outlined field with a static label above the input.
//
// The floating label was the reason the field needed a `placeholder=" "`
// sentinel and a focused/hasValue state pair just to know where to draw its
// own label. A label element above the control needs none of that, and it is
// the pattern that survives autofill, zoom and translation.
const TextField = React.forwardRef(function TextField(
  {
    label,
    name,
    type = 'text',
    multiline,
    rows = 4,
    required,
    helperText,
    error,
    fullWidth = true,
    placeholder,
    className = '',
    ...rest
  },
  ref
) {
  const id = useId();
  const helpId = `${id}-help`;
  const Tag = multiline ? 'textarea' : 'input';

  const cls = [
    'm3-tf',
    fullWidth ? 'm3-tf--full' : '',
    error ? 'm3-tf--error' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {label && (
        <label htmlFor={id} className="m3-tf__label">
          {label}
          {required && <span className="m3-tf__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <Tag
        ref={ref}
        id={id}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        required={required}
        placeholder={placeholder}
        className="m3-tf__input"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={helperText || error ? helpId : undefined}
        {...rest}
      />
      {(helperText || error) && (
        <span id={helpId} className="m3-tf__helper">
          {error || helperText}
        </span>
      )}
    </div>
  );
});

export default TextField;
