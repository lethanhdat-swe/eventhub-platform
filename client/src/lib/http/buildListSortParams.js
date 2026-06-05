/**
 * @param {Record<string, unknown>} params
 * @param {{ sortBy?: string | null, sortOrder?: string | null }} sort
 */
export function appendSortParams(params, { sortBy, sortOrder } = {}) {
  if (sortBy && sortOrder) {
    params.sortBy = sortBy;
    params.sortOrder = sortOrder;
  }

  return params;
}
