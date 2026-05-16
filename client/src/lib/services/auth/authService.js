import { axiosInstance } from '@/lib/http/axiosInstance';

const AUTH_BASE = '/api/auth';

export const authService = {
  register(data) {
    return axiosInstance.post(`${AUTH_BASE}/register`, data);
  },

  login(data) {
    return axiosInstance.post(`${AUTH_BASE}/login`, data);
  },

  googleLogin(data) {
    return axiosInstance.post(`${AUTH_BASE}/google-login`, data);
  },

  verifyEmail(data) {
    return axiosInstance.post(`${AUTH_BASE}/verify-email`, data);
  },

  forgotPassword(data) {
    return axiosInstance.post(`${AUTH_BASE}/forgot-password`, data);
  },

  verifyResetToken(data) {
    return axiosInstance.post(`${AUTH_BASE}/verify-reset-token`, data);
  },

  resetPassword(data) {
    return axiosInstance.post(`${AUTH_BASE}/reset-password`, data);
  },

  refreshToken(data) {
    return axiosInstance.post(`${AUTH_BASE}/refresh-token`, data);
  },

  logout(data) {
    return axiosInstance.post(`${AUTH_BASE}/logout`, data ?? {});
  },

  getMe() {
    return axiosInstance.get(`${AUTH_BASE}/me`);
  },
};
