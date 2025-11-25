const { groupDataHelpers } = require('../index')

const ugntBible = require('./fixtures/bibles/1jn/ugntBible.json')
const enGlBible = require('./fixtures/bibles/1jn/enGlBible.json')
const targetBible = require('./fixtures/bibles/1jn/targetBible.json')
const { generateChapterGroupIndex } = require('../helpers/groupDataHelpers')

const translate = (key, defaultStr) => {
  console.log(`translate(${key})`);
  return defaultStr;
};

describe('testing groupData generation', () => {
  it('create groupData', () => {
    const bookId = '1jn'
    const targetBook = targetBible
    const toolName = 'wordAligner'
    const groupsData = groupDataHelpers.generateChapterGroupData(bookId, targetBook, toolName)
    expect(groupsData).toMatchSnapshot()
  });

  it('create groupIndex', () => {
    const bookId = '1jn'
    const targetBook = targetBible
    const toolName = 'wordAligner'
    const groupsData = groupDataHelpers.generateChapterGroupData(bookId, targetBook, toolName)
    const groupsIndex = groupDataHelpers.generateChapterGroupIndex(translate, Object.keys(groupsData).length);
    expect(groupsIndex).toMatchSnapshot()
  });
});

//
// Helpers
//

