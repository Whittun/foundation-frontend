import type { JSONContent } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import s from './DayNoteViewer.module.css';

type DayNoteViewerProps = {
  content: JSONContent;
};

export const DayNoteViewer = ({ content }: DayNoteViewerProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender: false,
  });

  React.useEffect(() => {
    editor?.commands.setContent(content);
  }, [content, editor]);

  return (
    <div className={s.root}>
      <EditorContent editor={editor} className={s.viewer} />
    </div>
  );
};
