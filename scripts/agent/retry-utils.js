/**
 * Retry utilities for API calls with exponential backoff.
 */

const DEFAULT_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;

/**
 * Retry an async function with exponential backoff.
 *
 * @param {() => Promise<T>} fn - Async function to retry
 * @param {object} [opts]
 * @param {number} [opts.retries=3] - Max retry attempts
 * @param {number} [opts.baseDelayMs=1000] - Initial delay in ms
 * @param {string} [opts.label='operation'] - Label for log messages
 * @returns {Promise<T>}
 */
export async function retry(fn, opts = {}) {
  const { retries = DEFAULT_RETRIES, baseDelayMs = DEFAULT_BASE_DELAY_MS, label = 'operation' } = opts;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        console.log(`  ⏳ Retrying ${label} in ${delay}ms (attempt ${attempt}/${retries})…`);
        await sleep(delay);
      }
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const status = err?.status || err?.response?.status;
        const message = err?.message || String(err);
        console.warn(`  ⚠️  ${label} failed (attempt ${attempt + 1}): ${status ? `HTTP ${status} — ` : ''}${message}`);
      }
    }
  }

  throw lastError;
}

/** Sleep for the given milliseconds. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
