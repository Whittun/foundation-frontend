import { Modal } from '@/shared/ui/Modal';
import React from 'react';
import { DayNoteEditor } from './DayNoteEditor';
import { DayNoteViewer } from './DayNoteViewer';

type DayNoteModalMode = 'edit' | 'view';

type DayNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DayNoteModal = ({ isOpen, onClose }: DayNoteModalProps) => {
  const [mode] = React.useState<DayNoteModalMode>('view');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {mode === 'edit' ? <DayNoteEditor /> : <DayNoteViewer />}
    </Modal>
  );
};
