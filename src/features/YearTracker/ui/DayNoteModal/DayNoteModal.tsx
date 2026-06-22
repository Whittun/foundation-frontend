import { Modal } from '@/shared/ui/Modal';

type DayNoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DayNoteModal = ({ isOpen, onClose }: DayNoteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {null}
    </Modal>
  );
};
