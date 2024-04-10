/* eslint-env jest */
import {describe, expect, test} from '@jest/globals'
import path from "path-extra";
import fs from 'fs-extra';
import { extractGroupData, getPhraseFromTw, parseTwToIndex } from '../helpers/translationHelps/twArticleHelpers'

jest.unmock('fs-extra');

const enTaFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationAcademy/v79_unfoldingWord'
const enTwlFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationWordsLinks/v79_unfoldingWord'
const enTwFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationWords/v79_unfoldingWord'
const enUltFolder = '/Users/blm0/translationCore/resources/en/bibles/ult/v79_unfoldingWord'
const enTnFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationNotes/v79_unfoldingWord'

describe('read resources', () => {
  test(`read tA`, () => {
    const filePath = enTaFolder
    const data = readFolder(filePath)
    expect(data)
    const groupData = extractGroupData(data)
    expect(Object.keys(groupData).length).toEqual(3)
  });

  test(`read tWl 1jn`, () => {
    const filePath = enTwlFolder
    const data = readFolder(filePath, '1jn')
    expect(data)
    const groupData = extractGroupData(data)
    expect(Object.keys(groupData).length).toEqual(3)
  });

  test(`read tN 1jn`, () => {
    const filePath = enTnFolder
    const data = readFolder(filePath, '1jn')
    expect(data)
    const groupData = extractGroupData(data)
    expect(Object.keys(groupData).length).toEqual(3)
  });

  test(`read tW`, () => {
    const filePath = enTwFolder
    const data = readFolder(filePath)
    const groupsIndex = parseTwToIndex(data)
    expect(data)
    expect(groupsIndex.length > 0)
    const phrase = getPhraseFromTw(data, 'know')
    expect(phrase)
  });

  test(`read en ult`, () => {
    const filePath = enUltFolder
    const data = readFolder(filePath)
    expect(data)
  });

})


//////////////////////////////
// Testing Support functions
//////////////////////////////

function readJsonFile(jsonPath) {
  if (fs.existsSync(jsonPath)) {
    try {
      const resourceManifest = fs.readJsonSync(jsonPath);
      return resourceManifest;
    } catch (e) {
      console.error(`getLocalResourceList(): could not read ${jsonPath}`, e);
    }
  }
  return null;
}

function isDirectory(fullPath) {
  return fs.lstatSync(fullPath).isDirectory()
}

function readTextFile(filePath) {
  const data = fs.readFileSync(filePath, 'UTF-8').toString();
  return data
}

function readFolder(folderPath, filterBook = '') {
  const contents = {}
  const files = fs.readdirSync(folderPath)
  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const key = path.base(file)
    const type = path.extname(file)
    if (type === '.json') {
      const data = readJsonFile(filePath)
      if (data) {
        contents[key] = data
      }
    } else if (type === '.md') {
      const data = readTextFile(filePath)
      if (data) {
        contents[key] = data
      }
    } else if (isDirectory(filePath)) {
      if ((key === 'groups') && filterBook) {
        const bookPath = path.join(filePath, filterBook)
        const data = readFolder(bookPath)
        contents[key] = data
      } else {
        const data = readFolder(filePath, filterBook)
        contents[key] = data
      }
    }
  }
  return contents
}
