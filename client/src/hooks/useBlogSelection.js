import { useState } from 'react';

export function useBlogSelection() {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const selectAll = (checked, blogs) => {
    if (checked) {
      setSelectedIds(new Set(blogs.map((b) => b.id)));
      return;
    }

    setSelectedIds(new Set());
  };

  const selectRow = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  return {
    selectedIds,
    setSelectedIds,
    selectAll,
    selectRow,
  };
}