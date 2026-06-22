import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { Bold, Heading2, Italic, List, ListOrdered } from 'lucide-react';
import s from './DayNoteEditor.module.css';

export const DayNoteEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editable: true,
    immediatelyRender: false,
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive('bold') ?? false,
      isItalic: editor?.isActive('italic') ?? false,
      isHeading: editor?.isActive('heading', { level: 2 }) ?? false,
      isBulletList: editor?.isActive('bulletList') ?? false,
      isOrderedList: editor?.isActive('orderedList') ?? false,
    }),
  });

  return (
    <div className={s.root}>
      <div className={s.toolbar}>
        <button
          className={clsx(s.toolbarButton, editorState?.isBold && s.active)}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          type="button"
          disabled={!editor}
          aria-label="Bold"
        >
          <Bold />
        </button>
        <button
          className={clsx(s.toolbarButton, editorState?.isItalic && s.active)}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          type="button"
          disabled={!editor}
          aria-label="Italic"
        >
          <Italic />
        </button>
        <button
          className={clsx(s.toolbarButton, editorState?.isHeading && s.active)}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
          disabled={!editor}
          aria-label="Heading"
        >
          <Heading2 />
        </button>
        <button
          className={clsx(s.toolbarButton, editorState?.isBulletList && s.active)}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          type="button"
          disabled={!editor}
          aria-label="Bullet list"
        >
          <List />
        </button>
        <button
          className={clsx(s.toolbarButton, editorState?.isOrderedList && s.active)}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          type="button"
          disabled={!editor}
          aria-label="Ordered list"
        >
          <ListOrdered />
        </button>
      </div>

      <EditorContent editor={editor} className={s.editor} />
    </div>
  );
};
