import ChatActionChip from './ChatActionChip';
import { isChipAction, isRenderableAction, isWidgetAction } from './chatActionTypes';
import { useChatActionHandlers } from './useChatActionHandlers';
import ChatActionWidget from './widgets/ChatActionWidget';

function ChatMessageActions({ messageId, actions, onSendMessage, onOpenRefundForm }) {
  const handleAction = useChatActionHandlers({ onSendMessage, onOpenRefundForm });

  if (!Array.isArray(actions) || actions.length === 0) return null;

  const visibleActions = actions.filter(isRenderableAction);

  if (visibleActions.length === 0) return null;

  const widgetActions = visibleActions.filter(isWidgetAction);
  const chipActions = visibleActions.filter(isChipAction);

  return (
    <div className="mt-2.5 space-y-2 border-t border-(--border-color)/60 pt-2.5">
      {widgetActions.map((action, index) => (
        <ChatActionWidget
          key={`${messageId}-widget-${index}`}
          action={action}
          onActivate={() => handleAction(action)}
        />
      ))}

      {chipActions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chipActions.map((action, index) => (
            <ChatActionChip
              key={`${messageId}-chip-${index}`}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </ChatActionChip>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ChatMessageActions;
