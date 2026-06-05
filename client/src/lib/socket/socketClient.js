import { io } from 'socket.io-client';

import { authStorage } from '@/lib/auth/authStorage';

let socket = null;
let connectedToken = null;

function buildSocketOptions() {
  const token = authStorage.getAccessToken();

  return {
    autoConnect: true,
    auth: {
      token: token || undefined,
    },
  };
}

function shouldReconnectWithToken(nextToken) {
  if (!socket) return false;
  return connectedToken !== (nextToken || null);
}

export const getSocket = () => {
  const token = authStorage.getAccessToken();

  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, buildSocketOptions());
    connectedToken = token || null;
    return socket;
  }

  if (shouldReconnectWithToken(token)) {
    socket.auth = { token: token || undefined };
    connectedToken = token || null;

    if (socket.connected) {
      socket.disconnect();
    }

    socket.connect();
  }

  return socket;
};
