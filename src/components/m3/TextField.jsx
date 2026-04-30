import React, { useId, useState } from 'react';
import './TextField.css';

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
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    ...rest
  },
  ref
) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(
    Boolean(value ?? defaultValue ?? '')
  );

  const Tag = multiline ? 'textarea' : 'input';

  const cls = [
    'm3-tf',
    fullWidth ? 'm3-tf--full' : '',
    focused ? 'm3-tf--focused' : '',
    hasValue || focused || placeholder ? 'm3-tf--filled' : '',
    error ? 'm3-tf--error' : '',
    multiline ? 'm3-tf--multiline' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      <div className="m3-tf__field">
        <Tag
          ref={ref}
          id={id}
          name={name}
          type={multiline ? undefined : type}
          rows={multiline ? rows : undefined}
          required={required}
          placeholder={placeholder ?? ' '}
          value={value}
          defaultValue={defaultValue}
          className="m3-tf__input"
          aria-invalid={Boolean(error)}
          aria-describedby={helperText ? `${id}-help` : undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => {
            setFocused(false);
            setHasValue(Boolean(e.target.value));
            onBlur?.(e);
          }}
          onChange={(e) => {
            setHasValue(Boolean(e.target.value));
            onChange?.(e);
          }}
          {...rest}
        />
        {label && (
          <label htmlFor={id} className="m3-tf__label">
            {label}{required ? ' *' : ''}
          </label>
        )}
      </div>
      {helperText && (
        <span id={`${id}-help`} className="m3-tf__helper">{helperText}</span>
      )}
    </div>
  );
});

export default TextField;
