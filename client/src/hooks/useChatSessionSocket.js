import { useEffect, useRef } from 'react';

import { SOCKET_EVENTS } from '@/lib/socket/constants';
import { getSocket } from '@/lib/socket/socketClient';

const useChatSessionSocket = ({
  sessionId,
  guestId,
  enabled = true,
  onMessageCreated,
  onSessionUpdated,
  onError,
}) => {
  const onMessageCreatedRef = useRef(onMessageCreated);
  const onSessionUpdatedRef = useRef(onSessionUpdated);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageCreatedRef.current = onMessageCreated;
    onSessionUpdatedRef.current = onSessionUpdated;
    onErrorRef.current = onError;
  }, [onMessageCreated, onSessionUpdated, onError]);

  useEffect(() => {
    if (!enabled || !sessionId) return undefined;

    const socket = getSocket();

    const joinPayload = { sessionId };
    if (guestId) {
      joinPayload.guestId = guestId;
    }

    socket.emit(SOCKET_EVENTS.CHAT_JOIN_SESSION, joinPayload);

    const handleMessageCreated = (payload) => {
      if (payload?.sessionId !== sessionId) return;
      onMessageCreatedRef.current?.(payload);
    };

    const handleSessionUpdated = (payload) => {
      if (payload?.sessionId !== sessionId) return;
      onSessionUpdatedRef.current?.(payload);
    };

    const handleError = (payload) => {
      onErrorRef.current?.(payload);
    };

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE_CREATED, handleMessageCreated);
    socket.on(SOCKET_EVENTS.CHAT_SESSION_UPDATED, handleSessionUpdated);
    socket.on(SOCKET_EVENTS.CHAT_ERROR, handleError);

    return () => {
      socket.emit(SOCKET_EVENTS.CHAT_LEAVE_SESSION, { sessionId });
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE_CREATED, handleMessageCreated);
      socket.off(SOCKET_EVENTS.CHAT_SESSION_UPDATED, handleSessionUpdated);
      socket.off(SOCKET_EVENTS.CHAT_ERROR, handleError);
    };
  }, [sessionId, guestId, enabled]);
};

export default useChatSessionSocket;
