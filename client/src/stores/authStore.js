import { create } from 'zustand';

import { authStorage } from '@/lib/auth/authStorage';

/**
 * @param {{ accessToken?: string|null, refreshToken?: string|null, user?: object|null }} response
 */
function applyAuthResponse(set, response) {
  const accessToken = response.accessToken ?? null;
  const refreshToken = response.refreshToken ?? null;
  const user = response.user ?? null;
  set({
    user,
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken),
    isHydrated: true,
  });
}

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrateAuth() {
    const accessToken = authStorage.getAccessToken();
    const refreshToken = authStorage.getRefreshToken();
    const user = authStorage.getUser();
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isHydrated: true,
    });
  },

  /** @param {{ accessToken: string, refreshToken: string, user: object }} authResponse */
  setAuth(authResponse) {
    authStorage.setAuth(authResponse);
    applyAuthResponse(set, authResponse);
  },

  clearAuth() {
    authStorage.clearAuth();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },

  /** @param {{ accessToken: string, refreshToken: string }} tokens */
  setSessionTokens(tokens) {
    authStorage.setAccessToken(tokens.accessToken);
    authStorage.setRefreshToken(tokens.refreshToken);
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: Boolean(tokens.accessToken),
      isHydrated: true,
    });
  },

  setUser(user) {
    authStorage.setUser(user);
    set({ user });
  },
}));

useAuthStore.getState().hydrateAuth();
