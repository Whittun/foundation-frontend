import type { JSONContent } from '@tiptap/react';

export const mockDayNoteContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Mock day note' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is a ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'read-only note preview' },
        { type: 'text', text: ' rendered with ' },
        { type: 'text', marks: [{ type: 'italic' }], text: 'TipTap' },
        { type: 'text', text: '.' },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The content below intentionally uses every formatting option currently available in the editor toolbar and repeats enough text to test vertical overflow inside the modal.',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', marks: [{ type: 'bold' }], text: 'Bold bullet:' },
                { type: 'text', text: ' Rating context will go here later.' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', marks: [{ type: 'italic' }], text: 'Italic bullet:' },
                { type: 'text', text: ' Saved text will be loaded from the API.' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Plain bullet with a longer line to make wrapping visible in the viewer area.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'First ordered item for the morning summary.' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Second ordered item for the afternoon notes.' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Third ordered item for evening reflections.' }],
            },
          ],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Longer overflow sample' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', marks: [{ type: 'bold' }], text: 'Morning:' },
        {
          type: 'text',
          text: ' Felt focused and started with a clean plan. The day had a calm rhythm, with a few interruptions that were easy enough to recover from.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', marks: [{ type: 'italic' }], text: 'Afternoon:' },
        {
          type: 'text',
          text: ' Energy dipped for a bit, but the main tasks still moved forward. This paragraph is intentionally a little longer so the viewer has enough real text to scroll through.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', marks: [{ type: 'bold' }], text: 'Evening:' },
        {
          type: 'text',
          text: ' Wrapped up with notes for tomorrow and a small review of what worked. The goal here is just to create realistic height and spacing.',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Check how unordered lists behave near the bottom of the scroll area.',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Make sure list spacing stays readable in view mode.' },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Confirm that the modal itself does not grow beyond the viewport.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Open the note modal.' }] },
          ],
        },
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Scroll the note content.' }] },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Close the modal with the button, overlay, or Escape.' },
              ],
            },
          ],
        },
      ],
    },
    ...Array.from({ length: 8 }, (_, index) => ({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `Extra paragraph ${index + 1}. This is mock text for overflow testing.`,
        },
      ],
    })),
  ],
};
