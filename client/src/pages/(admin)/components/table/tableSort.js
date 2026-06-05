export const TABLE_SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

/**
 * @typedef {{ sortBy: string | null, sortOrder: 'asc' | 'desc' | null }} TableSortState
 */

/**
 * @param {TableSortState} current
 * @param {string} field
 * @param {TableSortState} [defaultSort]
 * @returns {TableSortState}
 */
export function getNextTableSort(current, field, defaultSort = { sortBy: null, sortOrder: null }) {
  if (current.sortBy !== field) {
    return {
      sortBy: field,
      sortOrder: TABLE_SORT_ORDER.ASC,
    };
  }

  if (current.sortOrder === TABLE_SORT_ORDER.ASC) {
    return {
      sortBy: field,
      sortOrder: TABLE_SORT_ORDER.DESC,
    };
  }

  return {
    sortBy: defaultSort.sortBy ?? null,
    sortOrder: defaultSort.sortOrder ?? null,
  };
}

/**
 * @param {TableSortState | null | undefined} sort
 * @returns {boolean}
 */
export function hasActiveTableSort(sort) {
  return Boolean(sort?.sortBy && sort?.sortOrder);
}
