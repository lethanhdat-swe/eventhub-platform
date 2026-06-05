const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'authUser';

/**
 * @param {string|null} raw
 */
function safeParseUser(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const authStorage = {
  /** @param {string} token */
  setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /** @param {string} token */
  setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /** @param {object} user */
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    return safeParseUser(localStorage.getItem(USER_KEY));
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  /** @param {{ accessToken: string, refreshToken: string, user: object }} response */
  setAuth(response) {
    authStorage.setAccessToken(response.accessToken);
    authStorage.setRefreshToken(response.refreshToken);
    authStorage.setUser(response.user);
  },

  clearAuth() {
    authStorage.removeAccessToken();
    authStorage.removeRefreshToken();
    authStorage.removeUser();
  },
};
