export const mockDayNoteContent = `
  <h2>Mock day note</h2>
  <p>This is a <strong>read-only note preview</strong> rendered with <em>TipTap</em>.</p>
  <p>The content below intentionally uses every formatting option currently available in the editor toolbar and repeats enough text to test vertical overflow inside the modal.</p>
  <ul>
    <li><strong>Bold bullet:</strong> Rating context will go here later.</li>
    <li><em>Italic bullet:</em> Saved text will be loaded from the API.</li>
    <li>Plain bullet with a longer line to make wrapping visible in the viewer area.</li>
  </ul>
  <ol>
    <li>First ordered item for the morning summary.</li>
    <li>Second ordered item for the afternoon notes.</li>
    <li>Third ordered item for evening reflections.</li>
  </ol>
  <h2>Longer overflow sample</h2>
  <p><strong>Morning:</strong> Felt focused and started with a clean plan. The day had a calm rhythm, with a few interruptions that were easy enough to recover from.</p>
  <p><em>Afternoon:</em> Energy dipped for a bit, but the main tasks still moved forward. This paragraph is intentionally a little longer so the viewer has enough real text to scroll through.</p>
  <p><strong>Evening:</strong> Wrapped up with notes for tomorrow and a small review of what worked. The goal here is just to create realistic height and spacing.</p>
  <ul>
    <li>Check how unordered lists behave near the bottom of the scroll area.</li>
    <li>Make sure list spacing stays readable in view mode.</li>
    <li>Confirm that the modal itself does not grow beyond the viewport.</li>
  </ul>
  <ol>
    <li>Open the note modal.</li>
    <li>Scroll the note content.</li>
    <li>Close the modal with the button, overlay, or Escape.</li>
  </ol>
  <p>Extra paragraph 1. This is mock text for overflow testing.</p>
  <p>Extra paragraph 2. This is mock text for overflow testing.</p>
  <p>Extra paragraph 3. This is mock text for overflow testing.</p>
  <p>Extra paragraph 4. This is mock text for overflow testing.</p>
  <p>Extra paragraph 5. This is mock text for overflow testing.</p>
  <p>Extra paragraph 6. This is mock text for overflow testing.</p>
  <p>Extra paragraph 7. This is mock text for overflow testing.</p>
  <p>Extra paragraph 8. This is mock text for overflow testing.</p>
`;
