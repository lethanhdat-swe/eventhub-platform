import axios, { type AxiosError } from 'axios';

export type ParsedApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

function readMessageFromPayload(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined;
  }
  if (
    'message' in data &&
    (typeof (data as { message: unknown }).message === 'string' ||
      typeof (data as { message: unknown }).message === 'number')
  ) {
    return String((data as { message: unknown }).message);
  }
  if ('error' in data && typeof (data as { error: unknown }).error === 'string') {
    return (data as { error: string }).error;
  }
  return undefined;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<unknown>;
    const data = ax.response?.data;
    const messageFromBody = readMessageFromPayload(data);
    return {
      message: messageFromBody || ax.message || 'Đã có lỗi xảy ra',
      status: ax.response?.status,
      code: ax.code,
      details: data,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Đã có lỗi xảy ra' };
}

export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}
