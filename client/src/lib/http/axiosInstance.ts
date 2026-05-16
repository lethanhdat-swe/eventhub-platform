import axios, { type InternalAxiosRequestConfig } from 'axios';

import { getErrorMessage } from '@/lib/http/apiError';

/** Must match wherever login/session persists the JWT (adjust in one place only). */
export const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

export type HttpClient = {
  get<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  delete<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  head<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  options<T = unknown>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: InternalAxiosRequestConfig
  ): Promise<T>;
};

const rawInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

rawInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

rawInstance.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    console.error('[http]', getErrorMessage(error), error);
    return Promise.reject(error);
  }
);

export const axiosInstance = rawInstance as unknown as HttpClient;
