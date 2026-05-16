import axios from 'axios';

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Plain POST — không dùng axiosInstance (tránh vòng interceptor).
 * @param {string} refreshToken
 */
export function postRefreshToken(refreshToken) {
  return refreshClient.post('/api/auth/refresh-token', { refreshToken });
}
