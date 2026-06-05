import { isRenderableAction } from '@/components/AIChatWidget/ChatMessageActions/chatActionTypes';

import { CHAT_SESSION_STATUS, isHumanSupportStatus } from './chatSessionStatus';

export const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Xin chào, mình là EventHub AI. Mình có thể hỗ trợ bạn về đặt vé, thanh toán, QR ticket và hoàn vé.',
  actions: [],
};

function mapRole(role) {
  if (role === 'USER') return 'user';
  if (role === 'ASSISTANT') return 'assistant';
  if (role === 'SYSTEM') return 'system';
  if (role === 'ADMIN') return 'admin';
  return String(role ?? '').toLowerCase();
}

function mapActions(actions) {
  const actionItems = Array.isArray(actions?.items) ? actions.items : [];

  return actionItems
    .filter(isRenderableAction)
    .map((action) => ({
      type: action.type,
      label: action.label ?? null,
      payload: action.payload ?? null,
    }));
}

/**
 * @param {{ id?: string, role?: string, content?: string, createdAt?: string, actions?: { items?: unknown[] } }} message
 */
export function mapApiMessageToWidget(message) {
  if (!message) return null;

  return {
    id: message.id,
    role: mapRole(message.role),
    content: message.content ?? '',
    createdAt: message.createdAt ?? null,
    actions: mapActions(message.actions),
  };
}

/**
 * @param {unknown[]} items
 */
export function mapApiMessagesToWidget(items) {
  return (items ?? []).map(mapApiMessageToWidget).filter(Boolean);
}

export function withWelcomeIfEmpty(messages, sessionStatus = CHAT_SESSION_STATUS.ACTIVE) {
  if (messages.length > 0) return messages;
  if (isHumanSupportStatus(sessionStatus)) return [];
  return [WELCOME_MESSAGE];
}
