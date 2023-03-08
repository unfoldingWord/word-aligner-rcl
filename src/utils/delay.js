/**
 * wraps timer in a Promise to make an async function that continues after a specific number of milliseconds.
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
export default function delay(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}
