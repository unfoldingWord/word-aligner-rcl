/**
 * Retrieves a style measurement from the provided styles object based on the given key.
 *
 * @param {Object} styles - An object containing style properties and their values.
 * @param {string} key - The key to look up in the styles object.
 * @return {Object|null} An object containing the style's value as `value` and its integer representation as `intValue`
 * respectively, or empty object if the key does not exist or the value is invalid.
 */
export function getStyleMeasurement(styles, key) {
  if (styles[key]) {
    const value = styles[key];
    if (value) {
      const intValue = parseInt(value, 10)
      return { value, intValue };
    }
  }
  return { }
}
