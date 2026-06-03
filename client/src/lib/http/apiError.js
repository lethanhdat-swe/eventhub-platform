import axios from 'axios';

/** @type {Record<string, string>} */
const API_MESSAGE_VI = {
  'Validation failed': 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
  'Order not found': 'Không tìm thấy đơn hàng với mã đã nhập. Vui lòng kiểm tra lại mã đơn.',
  'Order not found.': 'Không tìm thấy đơn hàng với mã đã nhập. Vui lòng kiểm tra lại mã đơn.',
  'Order code is required': 'Vui lòng nhập mã đơn hàng.',
  'Invalid order code format':
    'Mã đơn hàng phải bắt đầu bằng EH (ví dụ: EH1730...).',
  'Internal Server Error': 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
  'Network Error': 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.',
};

/**
 * @param {unknown} data
 * @returns {string|undefined}
 */
function readValidationErrorsFromPayload(data) {
  if (typeof data !== 'object' || data === null || !('error' in data)) {
    return undefined;
  }

  const errorField = /** @type {{ error?: unknown }} */ (data).error;

  if (!Array.isArray(errorField) || errorField.length === 0) {
    return undefined;
  }

  const messages = errorField
    .map((item) => {
      if (typeof item !== 'object' || item === null || !('message' in item)) {
        return undefined;
      }
      const message = /** @type {{ message?: unknown }} */ (item).message;
      return typeof message === 'string' ? localizeApiMessage(message) : undefined;
    })
    .filter(Boolean);

  return messages.length > 0 ? messages.join(' ') : undefined;
}

/**
 * @param {string} message
 * @returns {string}
 */
function localizeApiMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) return 'Đã có lỗi xảy ra';

  if (API_MESSAGE_VI[trimmed]) {
    return API_MESSAGE_VI[trimmed];
  }

  if (/^Invalid order code/i.test(trimmed)) {
    return API_MESSAGE_VI['Invalid order code format'];
  }

  if (/^Order code is required/i.test(trimmed)) {
    return API_MESSAGE_VI['Order code is required'];
  }

  if (/^Order not found/i.test(trimmed)) {
    return API_MESSAGE_VI['Order not found'];
  }

  if (/^Validation failed/i.test(trimmed)) {
    return API_MESSAGE_VI['Validation failed'];
  }

  return trimmed;
}

/**
 * @param {unknown} data
 * @returns {string|undefined}
 */
function readMessageFromPayload(data) {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }

  const validationMessage = readValidationErrorsFromPayload(data);
  if (validationMessage) {
    return validationMessage;
  }

  if ('message' in data) {
    const m = /** @type {{ message?: unknown }} */ (data).message;
    if (typeof m === 'string' || typeof m === 'number') {
      return localizeApiMessage(String(m));
    }
  }
  if ('error' in data && typeof /** @type {{ error?: unknown }} */ (data).error === 'string') {
    return localizeApiMessage(/** @type {{ error: string }} */ (data).error);
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
    const fallbackMessage = error.message
      ? localizeApiMessage(error.message)
      : 'Đã có lỗi xảy ra';

    return {
      message: messageFromBody || fallbackMessage,
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
  const { message } = parseApiError(error);
  return message || 'Đã có lỗi xảy ra';
}
