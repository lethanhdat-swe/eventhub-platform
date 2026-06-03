import ChatActionChip from './ChatActionChip';
import {
  getValidBookingGuideSteps,
  isBookingGuideFlowAction,
  isChipAction,
  isRenderableAction,
  isWidgetAction,
} from './chatActionTypes';
import { useChatActionHandlers } from './useChatActionHandlers';
import BookingGuideFlow from './widgets/BookingGuideFlow';
import ChatActionWidget from './widgets/ChatActionWidget';

function chipGridColsClass(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2';
}

function ChatMessageActions({ messageId, actions, onSendMessage, onOpenRefundForm }) {
  const handleAction = useChatActionHandlers({ onSendMessage, onOpenRefundForm });

  if (!Array.isArray(actions) || actions.length === 0) return null;

  const visibleActions = actions.filter(isRenderableAction);

  if (visibleActions.length === 0) return null;

  const flowActions = visibleActions.filter(isBookingGuideFlowAction);
  const widgetActions = visibleActions.filter(isWidgetAction);
  const chipActions = visibleActions.filter(isChipAction);

  return (
    <div className="mt-2.5 space-y-2 border-t border-(--border-color)/60 pt-2.5">
      {flowActions.map((action, index) => (
        <BookingGuideFlow
          key={`${messageId}-flow-${index}`}
          steps={getValidBookingGuideSteps(action)}
          title={action.label}
        />
      ))}

      {widgetActions.map((action, index) => (
        <ChatActionWidget
          key={`${messageId}-widget-${index}`}
          action={action}
          onActivate={() => handleAction(action)}
        />
      ))}

      {chipActions.length > 0 ? (
        <div className={`grid gap-2 ${chipGridColsClass(chipActions.length)}`}>
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
