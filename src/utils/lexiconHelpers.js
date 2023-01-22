

export function getLexiconData(lexiconId, entryId) {
  try {
   let entryData= `dummy ${lexiconId} - ${entryId}`; // get file from fs
    return { [lexiconId]: { [entryId]: entryData } };
  } catch (error) {
    console.error('Error with getLexiconData()s');
    console.error(error);
  }
}
