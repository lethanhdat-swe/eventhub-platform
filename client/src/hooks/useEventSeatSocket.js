import { useEffect } from 'react';

import { SOCKET_EVENTS } from '@/lib/socket/constants';
import { getSocket } from '@/lib/socket/socketClient';

const useEventSeatSocket = (eventId, onSeatChanged) => {
  useEffect(() => {
    if (!eventId) return undefined;

    const socket = getSocket();

    socket.emit(SOCKET_EVENTS.SEAT_JOIN, { eventId });

    const handleSeatChanged = (payload) => {
      if (payload?.eventId === eventId) {
        onSeatChanged?.();
      }
    };

    socket.on(SOCKET_EVENTS.SEAT_CHANGED, handleSeatChanged);

    return () => {
      socket.emit(SOCKET_EVENTS.SEAT_LEAVE, { eventId });
      socket.off(SOCKET_EVENTS.SEAT_CHANGED, handleSeatChanged);
    };
  }, [eventId, onSeatChanged]);
};

export default useEventSeatSocket;
