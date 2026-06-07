import { authService } from '@/lib/services/auth/authService';
import { getApiData } from '@/lib/http/unwrapApiSuccess';

/**
 * Lấy thông tin user hiện tại từ server (role từ DB).
 * @returns {Promise<object>}
 */
export async function fetchSessionUser() {
  const body = await authService.getMe();
  return getApiData(body);
}
