import { useEffect, useRef } from 'react';

import { SOCKET_EVENTS } from '@/lib/socket/constants';
import { getSocket } from '@/lib/socket/socketClient';

const useAdminChatDashboardSocket = ({
  enabled = true,
  onSessionUpdated,
  onError,
}) => {
  const onSessionUpdatedRef = useRef(onSessionUpdated);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSessionUpdatedRef.current = onSessionUpdated;
    onErrorRef.current = onError;
  }, [onSessionUpdated, onError]);

  useEffect(() => {
    if (!enabled) return undefined;

    const socket = getSocket();

    socket.emit(SOCKET_EVENTS.ADMIN_CHAT_JOIN_DASHBOARD);

    const handleSessionUpdated = (payload) => {
      onSessionUpdatedRef.current?.(payload);
    };

    const handleError = (payload) => {
      onErrorRef.current?.(payload);
    };

    socket.on(SOCKET_EVENTS.ADMIN_CHAT_SESSION_UPDATED, handleSessionUpdated);
    socket.on(SOCKET_EVENTS.ADMIN_CHAT_ERROR, handleError);

    return () => {
      socket.off(SOCKET_EVENTS.ADMIN_CHAT_SESSION_UPDATED, handleSessionUpdated);
      socket.off(SOCKET_EVENTS.ADMIN_CHAT_ERROR, handleError);
    };
  }, [enabled]);
};

export default useAdminChatDashboardSocket;
