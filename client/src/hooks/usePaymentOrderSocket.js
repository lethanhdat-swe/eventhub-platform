import { useEffect } from 'react';

import { SOCKET_EVENTS } from '@/lib/socket/constants';
import { getSocket } from '@/lib/socket/socketClient';

const usePaymentOrderSocket = (
  orderId,
  { onPaid, onFailed, onExpired, enabled = true } = {}
) => {
  useEffect(() => {
    if (!enabled || !orderId) return undefined;

    const socket = getSocket();

    socket.emit(SOCKET_EVENTS.PAYMENT_JOIN, { orderId });

    const handlePaid = (payload) => {
      if (payload?.orderId !== orderId) return;
      onPaid?.(payload);
    };

    const handleFailed = (payload) => {
      if (payload?.orderId !== orderId) return;
      onFailed?.(payload);
    };

    const handleExpired = (payload) => {
      if (payload?.orderId !== orderId) return;
      onExpired?.(payload);
    };

    socket.on(SOCKET_EVENTS.PAYMENT_PAID, handlePaid);
    socket.on(SOCKET_EVENTS.PAYMENT_FAILED, handleFailed);
    socket.on(SOCKET_EVENTS.PAYMENT_EXPIRED, handleExpired);

    return () => {
      socket.emit(SOCKET_EVENTS.PAYMENT_LEAVE, { orderId });
      socket.off(SOCKET_EVENTS.PAYMENT_PAID, handlePaid);
      socket.off(SOCKET_EVENTS.PAYMENT_FAILED, handleFailed);
      socket.off(SOCKET_EVENTS.PAYMENT_EXPIRED, handleExpired);
    };
  }, [orderId, enabled, onPaid, onFailed, onExpired]);
};

export default usePaymentOrderSocket;
