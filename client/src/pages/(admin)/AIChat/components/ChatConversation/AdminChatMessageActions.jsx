import BookingGuideFlow from '@/components/AIChatWidget/ChatMessageActions/widgets/BookingGuideFlow';
import {
  getValidBookingGuideSteps,
  isBookingGuideFlowAction,
  isChipAction,
  isRenderableAction,
  isWidgetAction,
} from '@/components/AIChatWidget/ChatMessageActions/chatActionTypes';

function chipGridColsClass(count) {
  if (count <= 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2';
}

function ReadOnlyActionChip({ children }) {
  return (
    <span className="inline-flex h-9 w-full min-w-0 items-center justify-center truncate rounded-full border bg-muted/50 px-2 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

function ReadOnlyWidgetAction({ action }) {
  const label = action.label ?? action.type;

  return (
    <span className="inline-flex h-9 w-full items-center justify-center rounded-lg border bg-muted/40 px-3 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function AdminChatMessageActions({ messageId, actions }) {
  if (!Array.isArray(actions) || actions.length === 0) return null;

  const visibleActions = actions.filter(isRenderableAction);
  if (visibleActions.length === 0) return null;

  const flowActions = visibleActions.filter(isBookingGuideFlowAction);
  const widgetActions = visibleActions.filter(isWidgetAction);
  const chipActions = visibleActions.filter(isChipAction);

  return (
    <div className="mt-2.5 space-y-2 border-t border-border/60 pt-2.5">
      {flowActions.map((action, index) => (
        <BookingGuideFlow
          key={`${messageId}-flow-${index}`}
          steps={getValidBookingGuideSteps(action)}
          title={action.label}
        />
      ))}

      {widgetActions.map((action, index) => (
        <ReadOnlyWidgetAction
          key={`${messageId}-widget-${index}`}
          action={action}
        />
      ))}

      {chipActions.length > 0 ? (
        <div className={`grid gap-2 ${chipGridColsClass(chipActions.length)}`}>
          {chipActions.map((action, index) => (
            <ReadOnlyActionChip key={`${messageId}-chip-${index}`}>
              {action.label}
            </ReadOnlyActionChip>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AdminChatMessageActions;
