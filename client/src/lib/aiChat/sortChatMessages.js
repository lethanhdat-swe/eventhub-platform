/**
 * @param {{ id?: string, createdAt?: string|null }[]} messages
 */
export function sortMessagesChronologically(messages) {
  return [...(messages ?? [])].sort((left, right) => {
    const leftTime = left?.createdAt ? new Date(left.createdAt).getTime() : 0;
    const rightTime = right?.createdAt ? new Date(right.createdAt).getTime() : 0;

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return String(left?.id ?? '').localeCompare(String(right?.id ?? ''));
  });
}
