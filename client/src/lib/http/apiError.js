import axios from 'axios';

/**
 * @param {unknown} data
 * @returns {string|undefined}
 */
function readMessageFromPayload(data) {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }
  if ('message' in data) {
    const m = /** @type {{ message?: unknown }} */ (data).message;
    if (typeof m === 'string' || typeof m === 'number') {
      return String(m);
    }
  }
  if ('error' in data && typeof /** @type {{ error?: unknown }} */ (data).error === 'string') {
    return /** @type {{ error: string }} */ (data).error;
  }
  return undefined;
}

/**
 * @param {unknown} error
 */
export function parseApiError(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const messageFromBody = readMessageFromPayload(data);
    return {
      message: messageFromBody || error.message || 'Đã có lỗi xảy ra',
      status: error.response?.status,
      code: error.code,
      details: data,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Đã có lỗi xảy ra' };
}

/**
 * @param {unknown} error
 */
export function getErrorMessage(error) {
  return parseApiError(error).message;
}
