import fs from 'fs-extra'
import path from 'path'

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

export function readHelpsFolder(folderPath, filterBook = '') {
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
        const data = readHelpsFolder(bookPath)
        contents[key] = data
      } else {
        const data = readHelpsFolder(filePath, filterBook)
        contents[key] = data
      }
    }
  }
  return contents
}
