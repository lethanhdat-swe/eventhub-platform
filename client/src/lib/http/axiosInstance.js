import axios from 'axios';

import { authStorage } from '@/lib/auth/authStorage';
import { getErrorMessage } from '@/lib/http/apiError';
import { postRefreshToken } from '@/lib/http/refreshApi';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { useAuthStore } from '@/stores/authStore';

/** Các route 401 do nghiệp vụ (sai mật khẩu, …) — không gọi refresh. */
const AUTH_PUBLIC_401_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google-login',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-reset-token',
  '/api/auth/refresh-token',
];

/** @param {import('axios').InternalAxiosRequestConfig} config */
function getNormalizedPath(config) {
  const url = config.url || '';
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) {
    try {
      return new URL(url).pathname;
    } catch {
      return url.split('?')[0];
    }
  }
  const base = config.baseURL || '';
  if (base) {
    try {
      const resolved = new URL(url.replace(/^\//, ''), base.endsWith('/') ? base : `${base}/`);
      return resolved.pathname;
    } catch {
      /* fall through */
    }
  }
  return url.startsWith('/') ? url.split('?')[0] : `/${url.split('?')[0]}`;
}

/** @param {import('axios').InternalAxiosRequestConfig} config */
function shouldSkipTokenRefresh(config) {
  const path = getNormalizedPath(config);
  return AUTH_PUBLIC_401_PATHS.some((p) => path === p);
}

let refreshInFlight = null;

async function refreshSessionOnce() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const token = authStorage.getRefreshToken();
      if (!token) {
        throw new Error('NO_REFRESH_TOKEN');
      }
      const res = await postRefreshToken(token);
      const payload = getApiData(res.data);
      useAuthStore.getState().setSessionTokens({
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      });
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/** @param {import('axios').InternalAxiosRequestConfig} config */
function stripAuthorizationHeader(config) {
  if (!config.headers) return;
  const h = config.headers;
  if (typeof h.delete === 'function') {
    h.delete('Authorization');
    h.delete('authorization');
  } else {
    delete h.Authorization;
    delete h.authorization;
  }
}

const rawInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

rawInstance.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

rawInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const { config, response } = error;

    if (response?.status !== 401) {
      console.error('[http]', getErrorMessage(error), error);
      return Promise.reject(error);
    }

    if (shouldSkipTokenRefresh(config)) {
      console.error('[http]', getErrorMessage(error), error);
      return Promise.reject(error);
    }

    if (config._retry) {
      useAuthStore.getState().clearAuth();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    config._retry = true;

    if (!authStorage.getRefreshToken()) {
      useAuthStore.getState().clearAuth();
      window.location.assign('/login');
      return Promise.reject(error);
    }

    try {
      await refreshSessionOnce();
    } catch (refreshErr) {
      useAuthStore.getState().clearAuth();
      window.location.assign('/login');
      return Promise.reject(refreshErr);
    }

    stripAuthorizationHeader(config);
    return rawInstance.request(config);
  }
);

/** Response interceptor trả body JSON ({ success, message, data }); không còn lớp Axios response. */
export const axiosInstance = rawInstance;
