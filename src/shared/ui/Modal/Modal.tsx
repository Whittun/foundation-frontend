import { X } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

type ModalProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div className={s.content} onClick={(event) => event.stopPropagation()}>
        <button className={s.closeButton} onClick={onClose} aria-label="Close modal">
          <X />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
