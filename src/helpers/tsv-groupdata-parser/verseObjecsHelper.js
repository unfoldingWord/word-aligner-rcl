/* eslint-disable array-callback-return */
export function verseObjectsToString(verseObjects) {
  return (
    // eslint-disable-next-line prettier/prettier
    verseObjects.map((verseObject, index) => {
      let previousVerseObject = verseObjects[index - 1];

      if (previousVerseObject && previousVerseObject.children) {
        const { children } = previousVerseObject;
        previousVerseObject = children[children.length - 1];

        if (previousVerseObject.children) {
          const grandChildren = previousVerseObject.children;
          previousVerseObject = grandChildren[grandChildren.length - 1];
        }
      }

      if (previousVerseObject && previousVerseObject.text === ' ' && verseObject.text === ' ') {
        return '';
      }

      if (verseObject.text) {
        let text = verseObject.text;

        if (text.includes('\n')) {
          text = text.replace('\n', '\u0020');
        }
        return text;
      } else if (verseObject.children) {
        return ' ' + verseObjectsToString(verseObject.children);
      }
    })
      // join strings
      .join('')
      // remove double spaces
      .replace(/ {2}/gi, ' ')
      // remove spaces before commas
      .replace(/ , /gi, ', ')
      // remove spaces before periods
      .replace(/ ."/gi, '."')
      // remove space before apostrophes
      .replace(/ ’./gi, '’.')
      // replace space before semicolon
      .replace(/ ; /gi, '; ')
      // remove spaces before question marks
      .replace(/\s+([?])/gi, '$1')
      // remove whitespace from the beginning
      .trimLeft()
  );
}
