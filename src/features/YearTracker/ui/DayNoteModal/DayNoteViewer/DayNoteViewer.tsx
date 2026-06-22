import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { mockDayNoteContent } from '../mockDayNoteContent';
import s from './DayNoteViewer.module.css';

export const DayNoteViewer = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: mockDayNoteContent,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className={s.root}>
      <EditorContent editor={editor} className={s.viewer} />
    </div>
  );
};
