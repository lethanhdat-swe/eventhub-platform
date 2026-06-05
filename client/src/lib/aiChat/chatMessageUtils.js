/**
 * @param {{ id?: string }[]} messages
 * @param {string} id
 */
export function hasMessageId(messages, id) {
  if (!id) return false;
  return (messages ?? []).some((message) => message.id === id);
}

/**
 * @param {unknown[]} messages
 * @param {unknown|null|undefined} incoming
 */
export function appendUniqueMessage(messages, incoming) {
  if (!incoming) {
    return messages ?? [];
  }

  const list = messages ?? [];
  const messageId = incoming?.id;

  if (messageId && hasMessageId(list, messageId)) {
    return list;
  }

  return [...list, incoming];
}
