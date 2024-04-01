/**
 *
 * @param {object} translations - hierarchical object
 * @param {string} key - in format such as 'alert' or 'menu.label'
 * @returns {string}
 */
export function lookupTranslationForKey(translations, key) {
  const translation = `translate(${key})` // set to default value
  const steps = (key || '').split('.') // each level delimted by period
  let current = translations
  let newTranslation = null

  for (let step of steps ) { // drill down through each level
    if (step && current) {
      newTranslation = current[step]
      current = newTranslation
    } else { // not found
      current = null
    }
  }

  if (typeof newTranslation == 'string') {
    return newTranslation
  }
  return translation
}
