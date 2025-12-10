
export function generateItemId(occurrence, bookId, chapter, verse, quote, checkId) {
  let quoteId = '';

  if (Array.isArray(quote)) { // is a bit more complicated
    const parts = [];

    for (let i = 0, l = quote.length; i < l; i++) {
      const quotePart = quote[i];
      parts.push(quotePart.occurrence + ':' + quotePart.word);
    }
    quoteId = parts.join(':');
  } else {
    quoteId = `${occurrence}:${quote}`;
  }
  return `${checkId}:${quoteId}:${verse}:${chapter}:${bookId}`;
}
