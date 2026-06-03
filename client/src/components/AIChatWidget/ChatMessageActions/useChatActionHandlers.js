import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { CHAT_ACTION_TYPES } from './chatActionTypes';

export function useChatActionHandlers({ onSendMessage, onOpenRefundForm } = {}) {
  const navigate = useNavigate();

  return useCallback(
    (action) => {
      switch (action?.type) {
        case CHAT_ACTION_TYPES.NAVIGATE:
          if (action.payload?.path) {
            navigate(action.payload.path);
          }
          break;

        case CHAT_ACTION_TYPES.SEND_MESSAGE:
          if (action.payload?.message) {
            onSendMessage?.(action.payload.message);
          }
          break;

        case CHAT_ACTION_TYPES.OPEN_REFUND_FORM:
          onOpenRefundForm?.();
          break;

        default:
          console.warn('Unknown chat action:', action);
          break;
      }
    },
    [navigate, onSendMessage, onOpenRefundForm]
  );
}
