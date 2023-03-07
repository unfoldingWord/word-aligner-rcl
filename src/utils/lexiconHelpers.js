/**
 * for looking up the lexicon entry
 * @param {string} lexiconId
 * @param {string} entryId
 * @return {{}}
 */
export function getLexiconData(lexiconId, entryId) {
  try {
    //TODO: need to finish
   let entryData= `dummy ${lexiconId} - ${entryId}`; // get file from fs
    return { [lexiconId]: { [entryId]: entryData } };
  } catch (error) {
    console.error('Error with getLexiconData()s');
    console.error(error);
  }
}
