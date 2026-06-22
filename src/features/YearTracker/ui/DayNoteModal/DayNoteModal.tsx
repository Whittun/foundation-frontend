import { Modal } from '@/shared/ui/Modal';
import { Pencil, Save } from 'lucide-react';
import React from 'react';
import { DayNoteEditor } from './DayNoteEditor';
import s from './DayNoteModal.module.css';
import { DayNoteViewer } from './DayNoteViewer';
import { mockDayNoteContent } from './mockDayNoteContent';

type DayNoteModalMode = 'edit' | 'view';

type DayNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DayNoteModal = ({ isOpen, onClose }: DayNoteModalProps) => {
  const [mode, setMode] = React.useState<DayNoteModalMode>('view');

  const isEditing = mode === 'edit';

  const handleModeButtonClick = () => {
    setMode(isEditing ? 'view' : 'edit');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <button
        className={s.modeButton}
        onClick={handleModeButtonClick}
        type="button"
        aria-label={isEditing ? 'Save note' : 'Edit note'}
      >
        {isEditing ? <Save /> : <Pencil />}
      </button>
      {mode === 'edit' ? <DayNoteEditor content={mockDayNoteContent} /> : <DayNoteViewer />}
    </Modal>
  );
};
