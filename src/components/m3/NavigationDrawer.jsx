import React, { useEffect, useRef } from 'react';
import './NavigationDrawer.css';

const NavigationDrawer = ({ open, onClose, children, side = 'right' }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);

    const prev = document.activeElement;
    const focusable = drawerRef.current?.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`m3-drawer-scrim ${open ? 'm3-drawer-scrim--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`m3-drawer m3-drawer--${side} ${open ? 'm3-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        {children}
      </aside>
    </>
  );
};

export default NavigationDrawer;
