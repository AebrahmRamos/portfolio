import React, { useEffect, useRef } from 'react';
import './Dialog.css';

const Dialog = ({ open, onClose, ariaLabel, ariaLabelledby, className = '', children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleClose = () => onClose?.();
    const handleClick = (e) => {
      if (e.target === dialog) onClose?.();
    };
    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={`m3-dialog ${className}`}
      aria-label={ariaLabelledby ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </dialog>
  );
};

export default Dialog;
