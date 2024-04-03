/* eslint-env jest */
import {describe, expect, test} from '@jest/globals'
import path from "path-extra";
import fs from 'fs-extra';
import tWdata from './fixtures/translationWords/enTw.json'
import { parseTwToIndex } from '../helpers/translationHelps/twArticleHelpers'

jest.unmock('fs-extra');

const enTaFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationAcademy/v79_unfoldingWord'
const enTwlFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationWordsLinks/v79_unfoldingWord'
const enTwFolder = '/Users/blm0/translationCore/resources/en/translationHelps/translationWords/v79_unfoldingWord'
const enUltFolder = '/Users/blm0/translationCore/resources/en/bibles/ult/v79_unfoldingWord'

describe('read resources', () => {
  test(`read tA`, () => {
    const filePath = enTaFolder
    const data = readFolder(filePath)
    expect(data)
  });

  test(`read tW`, () => {
    const filePath = enTwFolder
    const data = readFolder(filePath)
    const groupsIndex = parseTwToIndex(data)
    expect(data)
    expect(groupsIndex.length > 0)
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

function readFolder(folderPath) {
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
      const data = readFolder(filePath)
      contents[key] = data
    }
  }
  return contents
}
