"""Apply shared list shell to admin index pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src/pages/(admin)"

# rel_path, page_key, filtered_var, columns, min_width, bulk_suffix, table_tag_open through props
CONFIGS = [
    (
        "Events/index.jsx",
        "events",
        "filteredEvents",
        8,
        "min-w-[960px]",
        "sự kiện",
        """      <EventTable
        events={filteredEvents}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onView={(id) => navigate(`/admin/events/${id}`)}
        onEdit={(id) => navigate(`/admin/events/${id}/edit`)}
        onDelete={(event) => setDeleteDialog({ type: 'single', event })}
      />""",
        "onAction={() => navigate('/admin/events/create')}",
        """      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} sự kiện`}
      >
        <Button
          type="button"
          variant="destructive"
          className="h-9 px-3"
          onClick={() => setDeleteDialog({ type: 'bulk' })}
        >
          Xóa đã chọn
        </Button>
      </AdminBulkActions>""",
        False,
    ),
]

# For brevity in execution, process each file with template replacement markers

IMPORT_BLOCK = """import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
"""

PAGINATION_IMPORT = """import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
"""


def strip_pagination_import(text: str) -> str:
    return text.replace(PAGINATION_IMPORT, "")


def add_table_import(text: str) -> str:
    if "AdminBulkActions" in text:
        return text
    anchor = "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';"
    return text.replace(anchor, anchor + "\n" + IMPORT_BLOCK)


def add_loading_vars(text: str, filtered_var: str) -> str:
    if "const isLoading = false" in text:
        return text
    needle = f"  const {filtered_var} = useMemo("
    idx = text.find(needle)
    if idx == -1:
        return text
    end = text.find(");\n\n", idx)
    if end == -1:
        return text
    insert_at = end + len(");\n\n")
    insert = (
        f"  const isLoading = false;\n"
        f"  const isEmpty = !isLoading && {filtered_var}.length === 0;\n\n"
    )
    return text[:insert_at] + insert + text[insert_at:]


def replace_space(text: str) -> str:
    return text.replace('className="space-y-3"', 'className="space-y-4"')


def build_content_shell(
    filtered_var: str,
    columns: int,
    min_width: str,
    page_key: str,
    on_action: str,
    bulk_block: str,
    table_block: str,
) -> str:
    action_line = f"          {on_action}\n" if on_action else ""
    return f"""{bulk_block}

      {{isLoading ? (
        <AdminLoadingState rows={{6}} columns={{{columns}}} minWidth="{min_width}" />
      ) : isEmpty ? (
        <AdminEmptyState
          {{...ADMIN_EMPTY_STATES.{page_key}}}
{action_line}        />
      ) : (
        <>
{table_block}
          <AdminPagination
            currentPage={{1}}
            totalPages={{1}}
            totalItems={{{filtered_var}.length}}
            pageSize={{10}}
          />
        </>
      )}}"""


# Manual configs for all pages
ALL = [
    {
        "file": "Events/index.jsx",
        "filtered": "filteredEvents",
        "cols": 8,
        "min_w": "min-w-[960px]",
        "key": "events",
        "on_action": "          onAction={() => navigate('/admin/events/create')}",
        "bulk": """      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} sự kiện`}
      >
        <Button type="button" variant="destructive" className="h-9 px-3" onClick={() => setDeleteDialog({ type: 'bulk' })}>
          Xóa đã chọn
        </Button>
      </AdminBulkActions>""",
        "table": """          <EventTable
            events={filteredEvents}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onView={(id) => navigate(`/admin/events/${id}`)}
            onEdit={(id) => navigate(`/admin/events/${id}/edit`)}
            onDelete={(event) => setDeleteDialog({ type: 'single', event })}
          />""",
        "start": "      {selectedIds.size > 0 ? (",
        "end_before": "      <DeleteEventDialog",
    },
]

print("Use manual updates - script documents pattern only")
