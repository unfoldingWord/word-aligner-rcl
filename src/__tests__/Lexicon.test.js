/* eslint-disable array-callback-return */
import path from 'path-extra';
import fs from 'fs-extra';
import ospath from 'ospath';

jest.unmock('fs-extra');

const resourcesFolder = path.join(ospath.home(), 'translationCore', 'resources');
const greekLexicon = path.join(resourcesFolder, `en/lexicons/ugl/v0_Door43-Catalog/content`);
const hebrewLexicon = path.join(resourcesFolder, `en/lexicons/uhl/v0.1_Door43-Catalog/content`);
  
const lexicons = {};
let destFile = path.join(__dirname, './fixtures/lexicon/lexicons.json');

describe.skip('lexicons', () => {
  
  it('get greek', () => {
    readLexiconData(greekLexicon, 'ugl');
    readLexiconData(hebrewLexicon, 'uhl');
    console.log(lexicons);
    fs.writeJsonSync(destFile, lexicons);
  });
});

//
// Helpers
//

function readLexiconData(lexiconPath, lang) {
  const files = fs.readdirSync(lexiconPath);
  console.log(files);
  const langLexicon = {}
  lexicons[lang] = langLexicon
  for (const file of files) {
    const fileParts = path.parse(file);
    if (fileParts.ext === '.json') {
      const filePath = path.join(lexiconPath, file);
      const fileData = fs.readJsonSync(filePath);
      // console.log(fileData);
      const key = fileParts.name;
      langLexicon[key] = fileData;
    }
  }
  console.log(langLexicon)
}
