export function normalizeScanResult(data, token) {
  return {
    ...data,
    token: data?.token ?? token,
    status: data?.status ?? 'VALID',
    message: data?.message ?? 'Check-in thành công.',
    scannedAt:
      data?.scannedAt ??
      data?.checkedInAt ??
      new Date().toISOString(),
  };
}

export function createErrorResult({
  token,
  status,
  message,
}) {
  return {
    token,
    status,
    message,
    scannedAt: new Date().toISOString(),
  };
}

export function getStatusFromErrorCode(code) {
  if (code === 409) return 'DUPLICATE';
  return 'INVALID';
}