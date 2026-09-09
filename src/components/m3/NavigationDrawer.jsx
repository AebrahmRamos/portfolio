import React, { useEffect, useRef } from 'react';
import './NavigationDrawer.css';

const NavigationDrawer = ({ open, onClose, children, side = 'right' }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

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
        // aria-hidden alone was an accessibility violation: the closed drawer
        // stayed in the DOM with its links tabbable, so keyboard focus walked
        // into a panel screen readers had been told to ignore. `inert` removes
        // the whole subtree from focus and the a11y tree together, and it is
        // the attribute aria-hidden is supposed to be paired with here.
        // React 19 treats inert as a real boolean prop: an empty string is
        // falsy here and the attribute never lands.
        inert={!open || undefined}
      >
        {children}
      </aside>
    </>
  );
};

export default NavigationDrawer;
