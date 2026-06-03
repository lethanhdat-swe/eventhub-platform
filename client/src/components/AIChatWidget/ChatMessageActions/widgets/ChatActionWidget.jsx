import { CHAT_ACTION_TYPES } from '../chatActionTypes';
import RefundFormActionWidget from './RefundFormActionWidget';

const WIDGET_BY_TYPE = {
  [CHAT_ACTION_TYPES.OPEN_REFUND_FORM]: RefundFormActionWidget,
};

function ChatActionWidget({ action, onActivate }) {
  const Widget = WIDGET_BY_TYPE[action.type];

  if (!Widget) {
    console.warn('No widget registered for chat action:', action.type);
    return null;
  }

  return <Widget action={action} onActivate={onActivate} />;
}

export default ChatActionWidget;
