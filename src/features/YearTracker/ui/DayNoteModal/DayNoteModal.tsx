import { useGetDayNoteQuery, useSetDayNoteMutation } from '@/features/YearTracker/api/dayNotesApi';
import { formatDateTitle } from '@/shared/lib';
import { Modal } from '@/shared/ui/Modal';
import type { JSONContent } from '@tiptap/core';
import { Pencil, Save } from 'lucide-react';
import React from 'react';
import { DayNoteEditor } from './DayNoteEditor';
import s from './DayNoteModal.module.css';
import { DayNoteViewer } from './DayNoteViewer';

type DayNoteModalMode = 'edit' | 'view';

const emptyDayNoteContent: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

type DayNoteModalProps = {
  date: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export const DayNoteModal = ({ date, isOpen, onClose }: DayNoteModalProps) => {
  const [mode, setMode] = React.useState<DayNoteModalMode>('view');
  const [content, setContent] = React.useState<JSONContent>(emptyDayNoteContent);

  const {
    data: dayNote,
    isError,
    isFetching,
  } = useGetDayNoteQuery(date ?? '', {
    skip: !isOpen || date === null,
  });

  const [setDayNote, { isLoading: isSaving }] = useSetDayNoteMutation();

  const isEditing = mode === 'edit';

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isFetching) {
      return;
    }

    if (dayNote) {
      setContent(dayNote.contentJson);
      setMode('view');
      return;
    }

    setContent(emptyDayNoteContent);
    setMode('edit');
  }, [dayNote, isFetching, isOpen]);

  const handleContentChange = React.useCallback((updatedContent: JSONContent) => {
    setContent(updatedContent);
  }, []);

  const handleModeButtonClick = async () => {
    if (!isEditing) {
      setMode('edit');
      return;
    }

    if (date === null) {
      return;
    }

    const savedDayNote = await setDayNote({
      date,
      contentJson: content,
    }).unwrap();

    setContent(savedDayNote.contentJson);
    setMode('view');
  };

  if (date === null) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={s.title}>{formatDateTitle(date)}</h2>
      <button
        className={s.modeButton}
        onClick={handleModeButtonClick}
        type="button"
        disabled={isFetching || isSaving || isError}
        aria-label={isEditing ? 'Save note' : 'Edit note'}
      >
        {isEditing ? <Save /> : <Pencil />}
      </button>
      {isFetching && <div>loading...</div>}
      {isError && <div>error!</div>}
      {!isFetching &&
        !isError &&
        (mode === 'edit' ? (
          <DayNoteEditor content={content} onContentChange={handleContentChange} />
        ) : (
          <DayNoteViewer content={content} />
        ))}
    </Modal>
  );
};
