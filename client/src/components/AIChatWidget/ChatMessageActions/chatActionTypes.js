export const CHAT_ACTION_TYPES = {
  NAVIGATE: 'NAVIGATE',
  SEND_MESSAGE: 'SEND_MESSAGE',
  OPEN_REFUND_FORM: 'OPEN_REFUND_FORM',
  OPEN_REFUND_LOOKUP_FORM: 'OPEN_REFUND_LOOKUP_FORM',
  SHOW_BOOKING_GUIDE_FLOW: 'SHOW_BOOKING_GUIDE_FLOW',
};

/** Action types rendered as rich widgets (not chips). */
export const CHAT_WIDGET_ACTION_TYPES = new Set([
  CHAT_ACTION_TYPES.OPEN_REFUND_FORM,
  CHAT_ACTION_TYPES.OPEN_REFUND_LOOKUP_FORM,
]);

/** Action types rendered as compact chips. */
export const CHAT_CHIP_ACTION_TYPES = new Set([
  CHAT_ACTION_TYPES.NAVIGATE,
  CHAT_ACTION_TYPES.SEND_MESSAGE,
]);

export function isWidgetAction(action) {
  return Boolean(action?.type && CHAT_WIDGET_ACTION_TYPES.has(action.type));
}

export function isChipAction(action) {
  return Boolean(action?.type && CHAT_CHIP_ACTION_TYPES.has(action.type));
}

export function isBookingGuideFlowAction(action) {
  return action?.type === CHAT_ACTION_TYPES.SHOW_BOOKING_GUIDE_FLOW;
}

export function getValidBookingGuideSteps(action) {
  const steps = action?.payload?.steps;
  if (!Array.isArray(steps)) return [];
  return steps.filter(
    (s) => typeof s?.title === 'string' && s.title.trim().length > 0
  );
}

export function isRenderableAction(action) {
  if (!action?.type) return false;
  if (isBookingGuideFlowAction(action)) {
    return getValidBookingGuideSteps(action).length > 0;
  }
  if (isWidgetAction(action)) return true;
  return isChipAction(action) && Boolean(action.label);
}
