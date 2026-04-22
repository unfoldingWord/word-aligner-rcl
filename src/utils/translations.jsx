import React from 'react'

/**
 * Look up translation for key value.
 * @param {object} translations - hierarchical object
 * @param {string} key - in format such as 'alert' or 'menu.label'
 * @param {object} data - data to insert into translated string (e.g. instances of `${name}` will be replaced with `value.name`)
 * @param {string} defaultStr - default string to return if translation is not found
 * @returns {string}
 */
export function lookupTranslationForKey(translations, key, data = null, defaultStr = null) {
  const translation = defaultStr || `translate(${key})` // set to default value
  const steps = (key || '').split('.') // each level delimted by period
  let current = translations
  let newTranslation = translations[key] // check for an exact match first

  if (!newTranslation) { // if exact match not found
    for (let step of steps) { // drill down through each level
      if (step && current) {
        newTranslation = current[step]
        current = newTranslation
      } else { // not found
        current = null
      }
    }
  }

  if ((typeof newTranslation == 'string') && data) {
    for (const key of Object.keys(data)) {
      newTranslation = newTranslation.replaceAll('${' + key + '}', data[key]) // format `${key}`
      newTranslation = newTranslation.replaceAll('{{' + key + '}}', data[key]) // alternate format `{{key}}`
    }
  }

  if (typeof newTranslation == 'string') {
    return decodeString(newTranslation)
  }
  return translation
}

/**
 * checks for html tags in text, if so it will return it wrapped in div
 * @param text
 * @returns {JSX.Element|string}
 */
export function decodeString(text) {
  if (text?.includes('<')) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return text
}
