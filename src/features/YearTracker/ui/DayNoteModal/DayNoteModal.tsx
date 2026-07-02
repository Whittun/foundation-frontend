import { useGetDayNoteQuery, useSetDayNoteMutation } from '@/features/YearTracker/api/dayNotesApi';
import { formatDateTitle } from '@/shared/lib';
import { Modal } from '@/shared/ui/Modal';
import type { JSONContent } from '@tiptap/core';
import { Pencil, Save, Undo2 } from 'lucide-react';
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
  const [contentDate, setContentDate] = React.useState<string | null>(null);

  const {
    currentData: dayNote,
    isError,
    isFetching,
    isSuccess,
  } = useGetDayNoteQuery(date ?? '', {
    skip: !isOpen || date === null,
  });

  const [setDayNote, { isLoading: isSaving }] = useSetDayNoteMutation();

  const isEditing = mode === 'edit';
  const isContentReady = contentDate === date;

  React.useEffect(() => {
    if (!isOpen || date === null) {
      return;
    }

    if (isFetching || !isSuccess) {
      return;
    }

    if (dayNote) {
      setContent(dayNote.contentJson);
      setContentDate(date);
      setMode('view');
      return;
    }

    setContent(emptyDayNoteContent);
    setContentDate(date);
    setMode('edit');
  }, [date, dayNote, isFetching, isOpen, isSuccess]);

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
    setContentDate(date);
    setMode('view');
  };

  const handleCancelEditing = () => {
    setContent(dayNote?.contentJson ?? emptyDayNoteContent);
    setMode('view');
  };

  if (date === null) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className={s.title}>{formatDateTitle(date)}</h2>
      {isEditing && (
        <button
          className={`${s.modeButton} ${s.cancelButton}`}
          onClick={handleCancelEditing}
          type="button"
          disabled={isFetching || isSaving || isError}
          aria-label="Cancel editing"
        >
          <Undo2 />
        </button>
      )}
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
        isSuccess &&
        isContentReady &&
        (mode === 'edit' ? (
          <DayNoteEditor
            key={`editor-${date}`}
            content={content}
            onContentChange={handleContentChange}
          />
        ) : (
          <DayNoteViewer key={`viewer-${date}`} content={content} />
        ))}
    </Modal>
  );
};
