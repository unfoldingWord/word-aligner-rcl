/**
 * move cursor to end of text
 * @param e - synthetic event to adjust
 */
export const moveCursorToEnd = (e) => {
  const length = (e.target && e.target.value && e.target.value.length) || 0;

  if ( length > 0 ) {
    e.target.setSelectionRange(length, length); // TRICKY: we need to move cursor to end of text to match behavior of electron 3
  }
};

