import { create } from 'zustand';

import { authStorage } from '@/lib/auth/authStorage';
import { fetchSessionUser } from '@/lib/auth/sessionSync';

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

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  async syncSessionFromServer() {
    const accessToken = authStorage.getAccessToken();

    if (!accessToken) {
      get().clearAuth();
      return null;
    }

    const user = await fetchSessionUser();

    authStorage.setUser(user);
    set({
      user,
      accessToken,
      refreshToken: authStorage.getRefreshToken(),
      isAuthenticated: true,
      isHydrated: true,
    });

    return user;
  },

  async bootstrapAuth() {
    const accessToken = authStorage.getAccessToken();
    const refreshToken = authStorage.getRefreshToken();

    if (!accessToken) {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });
      return;
    }

    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isHydrated: false,
    });

    try {
      await get().syncSessionFromServer();
    } catch {
      get().clearAuth();
    }
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
  async setSessionTokens(tokens) {
    authStorage.setAccessToken(tokens.accessToken);
    authStorage.setRefreshToken(tokens.refreshToken);
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: Boolean(tokens.accessToken),
      isHydrated: false,
    });

    try {
      await get().syncSessionFromServer();
    } catch {
      get().clearAuth();
    }
  },

  /** Cập nhật profile — không cho client ghi đè role. */
  setUser(userPatch) {
    const { role: _ignoredRole, ...safePatch } = userPatch ?? {};
    const currentUser = get().user;
    const nextUser = { ...currentUser, ...safePatch };

    authStorage.setUser(nextUser);
    set({ user: nextUser });
  },
}));
