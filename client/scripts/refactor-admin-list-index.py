import re
from pathlib import Path

# (relative path under (admin), page_key, data_var, columns, bulk_label_suffix)
PAGES = [
    ("Events/index.jsx", "events", "filteredEvents", 8),
    ("EventCategories/index.jsx", "eventCategories", "filteredCategories", 6),
    ("Artists/index.jsx", "artists", "filteredArtists", 7),
    ("DefaultSeats/index.jsx", "defaultSeats", "filteredSeats", 7),
    ("TicketTypes/index.jsx", "ticketTypes", "filteredTicketTypes", 6),
    ("Tickets/index.jsx", "tickets", "filteredTickets", 8),
    ("Orders/index.jsx", "orders", "filteredOrders", 10),
    ("Coupons/index.jsx", "coupons", "filteredCoupons", 8),
    ("CheckInLogs/index.jsx", "checkInLogs", "filteredLogs", 9),
    ("Users/index.jsx", "users", "filteredUsers", 9),
    ("Notifications/index.jsx", "notifications", "filteredNotifications", 8),
]

ROOT = Path(__file__).resolve().parents[1] / "src/pages/(admin)"

TABLE_IMPORT = """import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
"""

PAGINATION_BLOCK = re.compile(
    r"\n\s*<Pagination className=\"justify-end\">[\s\S]*?</Pagination>\n",
    re.MULTILINE,
)

BULK_BLOCK = re.compile(
    r"\n\s*\{selectedIds\.size > 0 \? \([\s\S]*?\) : null\}\n",
    re.MULTILINE,
)


def extract_bulk_children(bulk_match: str) -> str:
    """Keep buttons inside bulk bar, drop wrapper and label p."""
    inner = bulk_match
    # remove outer conditional wrapper lines
    start = inner.find("<div")
    if start == -1:
        return ""
    inner = inner[start:]
    end = inner.rfind("</motion>")
    if end == -1:
        end = inner.rfind("</div>")
    inner = inner[: end + len("</div>")]
    # remove label paragraph
    inner = re.sub(
        r"<p className=\"text-sm font-medium leading-none\">[\s\S]*?</p>\s*",
        "",
        inner,
        count=1,
    )
    # unwrap single outer flex div if present
    m = re.match(
        r'\s*<div className="flex flex-wrap[^"]*">\s*([\s\S]*)\s*</div>\s*$',
        inner,
    )
    if m:
        inner = m.group(1).strip()
    # normalize button classes h-8 -> h-9
    inner = inner.replace('className="h-8 px-3"', 'className="h-9 px-3"')
    inner = inner.replace('size="sm"\n            className="h-8', 'className="h-9')
    inner = re.sub(r'size="sm"\s+className="h-8', 'className="h-9', inner)
    return inner


def table_component_name(path: Path) -> str:
    # Artists/index -> ArtistTable from import in file
    text = path.read_text(encoding="utf-8")
    m = re.search(r"import (\w+Table) from", text)
    return m.group(1) if m else "Table"


def main():
    for rel, page_key, data_var, columns in PAGES:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        table_name = table_component_name(path)

        if "AdminBulkActions" in text:
            print(f"Skip {rel} (already refactored)")
            continue

        bulk_match = BULK_BLOCK.search(text)
        bulk_children = extract_bulk_children(bulk_match.group(0)) if bulk_match else ""

        # Remove old pagination import block
        text = re.sub(
            r"import \{\n  Pagination,\n  PaginationContent,\n  PaginationItem,\n  PaginationLink,\n  PaginationNext,\n  PaginationPrevious,\n\} from '@/components/ui/pagination';\n",
            "",
            text,
        )

        # Insert table imports after AdminToolbar import
        if TABLE_IMPORT.strip() not in text:
            text = text.replace(
                "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';",
                "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';\n"
                + TABLE_IMPORT,
            )

        # Add loading state after filtered useMemo block (before first handleSelect)
        if "const isLoading = false" not in text:
            text = re.sub(
                r"(const filtered\w+ = useMemo\([\s\S]*?\);\n)",
                r"\1\n  const isLoading = false;\n  const isEmpty = !isLoading && "
                + data_var
                + ".length === 0;\n",
                text,
                count=1,
            )

        text = text.replace('className="space-y-3"', 'className="space-y-4"')

        if bulk_match:
            label = bulk_match.group(0)
            # extract Vietnamese label pattern
            lm = re.search(
                r"Đã chọn \{selectedIds\.size\} ([^<]+)",
                bulk_match.group(0),
            )
            suffix = lm.group(1).strip() if lm else ""
            new_bulk = f"""
      <AdminBulkActions
        selectedCount={{selectedIds.size}}
        label={{`Đã chọn ${{selectedIds.size}} {suffix}`}}
      >
        {bulk_children}
      </AdminBulkActions>
"""
            text = BULK_BLOCK.sub(new_bulk, text, count=1)

        # Replace Table + Pagination section
        table_call_pattern = re.compile(
            rf"<{table_name}[\s\S]*?/>",
            re.MULTILINE,
        )
        table_match = table_call_pattern.search(text)
        if not table_match:
            print(f"WARN: no table in {rel}")
            continue

        pag_match = PAGINATION_BLOCK.search(text)
        pag_removed = pag_match.group(0) if pag_match else ""

        empty_config = f"ADMIN_EMPTY_STATES.{page_key}"
        # find onAction for empty - from PageHeader onAction or form dialog
        on_action = None
        if "onAction={() => navigate('/admin/events/create')}" in text:
            on_action = "() => navigate('/admin/events/create')"
        elif "onAction={() => setFormDialog({ mode: 'create' })}" in text:
            on_action = "() => setFormDialog({ mode: 'create' })"
        elif 'onAction={() => setFormDialog({ mode: "create" })}' in text:
            on_action = '() => setFormDialog({ mode: "create" })'

        empty_props = f"{{...{empty_config}}}"
        if on_action and "actionLabel" in str(ADMIN_EMPTY_STATES):
            pass
        action_prop = f" onAction={{() => {{ {on_action.strip('() => ')} }} }}" if on_action else ""

        # simpler onAction wiring
        if "navigate('/admin/events/create')" in text:
            action_prop = " onAction={() => navigate('/admin/events/create')}"
        elif "setFormDialog({ mode: 'create' })" in text:
            action_prop = " onAction={() => setFormDialog({ mode: 'create' })}"

        new_section = f"""{{isLoading ? (
        <AdminLoadingState rows={{6}} columns={{{columns}}} />
      ) : isEmpty ? (
        <AdminEmptyState
          {{...{empty_config}}}
          {action_prop.strip()}
        />
      ) : (
        <>
          {table_match.group(0)}
          <AdminPagination
            currentPage={{1}}
            totalPages={{1}}
            totalItems={{{data_var}.length}}
            pageSize={{10}}
          />
        </>
      )}}"""

        # Fix the new_section - use proper JSX
        new_section = f"""{{isLoading ? (
        <AdminLoadingState rows={{6}} columns={{{columns}}} />
      ) : isEmpty ? (
        <AdminEmptyState
          {{...{empty_config}}}
          {action_prop}
        />
      ) : (
        <>
          {table_match.group(0)}
          <AdminPagination
            currentPage={{1}}
            totalPages={{1}}
            totalItems={{{data_var}.length}}
            pageSize={{10}}
          />
        </>
      )}}"""

        replacement = new_section
        old_block = table_match.group(0) + pag_removed
        text = text.replace(old_block, replacement, 1)

        path.write_text(text, encoding="utf-8")
        print(f"Refactored {rel}")


if __name__ == "__main__":
    main()
