import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src/pages/(admin)"

PAGINATION_IMPORT = re.compile(
    r"import \{\n  Pagination,\n  PaginationContent,\n  PaginationItem,\n  PaginationLink,\n  PaginationNext,\n  PaginationPrevious,\n\} from '@/components/ui/pagination';\n"
)

TABLE_IMPORT = """import {
  AdminBulkActions,
  AdminEmptyState,
  AdminLoadingState,
  AdminPagination,
  ADMIN_EMPTY_STATES,
} from '@/pages/(admin)/components/table';
"""

PAGES = [
    {
        "file": "EventCategories/index.jsx",
        "key": "eventCategories",
        "filtered": "filteredCategories",
        "cols": 6,
        "min_w": "min-w-[720px]",
        "bulk_label": "danh mục",
        "table": "CategoryTable",
        "on_action": "onAction={() => setFormDialog({ mode: 'create' })}",
    },
    {
        "file": "DefaultSeats/index.jsx",
        "key": "defaultSeats",
        "filtered": "filteredSeats",
        "cols": 7,
        "min_w": "min-w-[800px]",
        "bulk_label": "ghế",
        "table": "SeatTable",
        "on_action": "onAction={() => setFormDialog({ mode: 'create' })}",
    },
    {
        "file": "TicketTypes/index.jsx",
        "key": "ticketTypes",
        "filtered": "filteredTicketTypes",
        "cols": 6,
        "min_w": "min-w-[800px]",
        "bulk_label": "loại vé",
        "table": "TicketTypeTable",
        "on_action": "onAction={() => setFormDialog({ mode: 'create' })}",
    },
    {
        "file": "Tickets/index.jsx",
        "key": "tickets",
        "filtered": "filteredTickets",
        "cols": 8,
        "min_w": "min-w-[1000px]",
        "bulk_label": "vé",
        "table": "TicketTable",
        "on_action": None,
    },
    {
        "file": "Orders/index.jsx",
        "key": "orders",
        "filtered": "filteredOrders",
        "cols": 10,
        "min_w": "min-w-[1100px]",
        "bulk_label": "đơn hàng",
        "table": "OrderTable",
        "on_action": None,
    },
    {
        "file": "Coupons/index.jsx",
        "key": "coupons",
        "filtered": "filteredCoupons",
        "cols": 8,
        "min_w": "min-w-[900px]",
        "bulk_label": "mã giảm giá",
        "table": "CouponTable",
        "on_action": "onAction={() => setFormDialog({ mode: 'create' })}",
    },
    {
        "file": "Users/index.jsx",
        "key": "users",
        "filtered": "filteredUsers",
        "cols": 9,
        "min_w": "min-w-[1100px]",
        "bulk_label": "người dùng",
        "table": "UserTable",
        "on_action": None,
        "bulk_extra": True,
    },
    {
        "file": "Notifications/index.jsx",
        "key": "notifications",
        "filtered": "filteredNotifications",
        "cols": 8,
        "min_w": "min-w-[960px]",
        "bulk_label": "thông báo",
        "table": "NotificationTable",
        "on_action": "onAction={() => setFormDialog({ mode: 'create' })}",
    },
]


def extract_table_jsx(text: str, table_name: str) -> str | None:
    pat = re.compile(rf"(<motion{table_name}[\s\S]*?/>)", re.MULTILINE)
    m = pat.search(text)
    if m:
        return m.group(1)
    pat = re.compile(rf"(<{table_name}[\s\S]*?/>)", re.MULTILINE)
    m = pat.search(text)
    return m.group(1) if m else None


def extract_bulk_buttons(text: str) -> str:
    m = re.search(
        r"\{selectedIds\.size > 0 \? \([\s\S]*?<div className=\"flex flex-wrap items-center justify-between[\s\S]*?</p>\s*([\s\S]*?)</div>\s*\) : null\}",
        text,
    )
    if not m:
        return ""
    inner = m.group(1).strip()
    inner = re.sub(r'size="sm"\s*', "", inner)
    inner = inner.replace('className="h-8 px-3"', 'className="h-9 px-3"')
    inner = re.sub(
        r'<div className="flex flex-wrap gap-2">\s*([\s\S]*?)\s*</motion>',
        r"\1",
        inner,
    )
    inner = re.sub(
        r'<motion className="flex flex-wrap gap-2">\s*([\s\S]*?)\s*</motion>',
        r"\1",
        inner,
    )
    return inner.strip()


def process_checkin_logs(text: str) -> str:
    if "AdminBulkActions" in text:
        return text
    text = PAGINATION_IMPORT.sub("", text)
    text = text.replace(
        "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';",
        "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';\n" + TABLE_IMPORT,
    )
    text = text.replace(
        "  const filteredLogs = useMemo(\n    () => filterCheckInLogs(logs, searchQuery),\n    [logs, searchQuery]\n  );\n\n  const handleSelectAll",
        "  const filteredLogs = useMemo(\n    () => filterCheckInLogs(logs, searchQuery),\n    [logs, searchQuery]\n  );\n\n  const isLoading = false;\n  const isEmpty = !isLoading && filteredLogs.length === 0;\n\n  const handleSelectAll",
    )
    text = text.replace('className="space-y-3"', 'className="space-y-4"')

    bulk_old = re.search(
        r"\{selectedIds\.size > 0 \? \([\s\S]*?\) : null\}\n\n      <CheckInLogTable",
        text,
    )
    table_m = re.search(r"<CheckInLogTable[\s\S]*?/>", text)
    pag_m = re.search(
        r"\n      <Pagination className=\"justify-end\">[\s\S]*?</Pagination>",
        text,
    )
    if not table_m:
        return text

    new_bulk = """      <AdminBulkActions
        selectedCount={selectedIds.size}
        label={`Đã chọn ${selectedIds.size} bản ghi`}
      >
        <Button type="button" variant="outline" className="h-9 px-3" onClick={handleExport}>
          Xuất file
        </Button>
        <Button type="button" variant="destructive" className="h-9 px-3" onClick={handleBulkMarkInvalid}>
          Đánh dấu lỗi
        </Button>
      </AdminBulkActions>"""

    new_content = f"""{new_bulk}

      {{isLoading ? (
        <AdminLoadingState rows={{6}} columns={{9}} minWidth="min-w-[1000px]" />
      ) : isEmpty ? (
        <AdminEmptyState {{...ADMIN_EMPTY_STATES.checkInLogs}} />
      ) : (
        <>
          {table_m.group(0)}
          <AdminPagination
            currentPage={{1}}
            totalPages={{1}}
            totalItems={{filteredLogs.length}}
            pageSize={{10}}
          />
        </>
      )}}"""

    if bulk_old:
        end = pag_m.end() if pag_m else table_m.end()
        start = bulk_old.start()
        text = text[:start] + new_content + text[end:]
    return text


def process_page(cfg: dict) -> None:
    path = ROOT / cfg["file"]
    text = path.read_text(encoding="utf-8")
    if "AdminBulkActions" in text:
        print("skip", cfg["file"])
        return

    table_name = cfg["table"]
    table_jsx = extract_table_jsx(text, table_name)
    if not table_jsx:
        print("NO TABLE", cfg["file"])
        return

    indented_table = "\n".join(
        "          " + line if line.strip() else line for line in table_jsx.splitlines()
    )

    bulk_buttons = extract_bulk_buttons(text)
    if not bulk_buttons and cfg.get("bulk_extra"):
        bulk_buttons = """<Button type="button" variant="outline" className="h-9 px-3" onClick={handleNotifySelected}>
              Gửi thông báo
            </Button>
            <Button type="button" variant="destructive" className="h-9 px-3" onClick={() => setDeleteDialog({ type: 'bulk' })}>
              Xóa đã chọn
            </Button>"""
    elif not bulk_buttons:
        bulk_buttons = """<Button type="button" variant="destructive" className="h-9 px-3" onClick={() => setDeleteDialog({ type: 'bulk' })}>
          Xóa đã chọn
        </Button>"""

    on_action_line = ""
    if cfg.get("on_action"):
        on_action_line = f"          {cfg['on_action']}\n"

    new_block = f"""      <AdminBulkActions
        selectedCount={{selectedIds.size}}
        label={{`Đã chọn ${{selectedIds.size}} {cfg['bulk_label']}`}}
      >
        {bulk_buttons}
      </AdminBulkActions>

      {{isLoading ? (
        <AdminLoadingState rows={{6}} columns={{{cfg['cols']}}} minWidth="{cfg['min_w']}" />
      ) : isEmpty ? (
        <AdminEmptyState
          {{...ADMIN_EMPTY_STATES.{cfg['key']}}}
{on_action_line}        />
      ) : (
        <>
{indented_table}
          <AdminPagination
            currentPage={{1}}
            totalPages={{1}}
            totalItems={{{cfg['filtered']}.length}}
            pageSize={{10}}
          />
        </>
      )}}"""

    text = PAGINATION_IMPORT.sub("", text)
    if TABLE_IMPORT.strip() not in text:
        text = text.replace(
            "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';",
            "import AdminToolbar from '@/pages/(admin)/components/AdminToolbar';\n" + TABLE_IMPORT,
        )

    filtered = cfg["filtered"]
    if "const isLoading = false" not in text:
        text = re.sub(
            rf"(const {filtered} = useMemo\([\s\S]*?\);\n)\n",
            rf"\1\n  const isLoading = false;\n  const isEmpty = !isLoading && {filtered}.length === 0;\n\n",
            text,
            count=1,
        )

    text = text.replace('className="space-y-3"', 'className="space-y-4"')

    bulk_m = re.search(
        r"\{selectedIds\.size > 0 \? \([\s\S]*?\) : null\}\n\n",
        text,
    )
    pag_m = re.search(
        r"\n      <Pagination className=\"justify-end\">[\s\S]*?</Pagination>\n",
        text,
    )

    if bulk_m:
        start = bulk_m.start()
        end = pag_m.end() if pag_m else table_jsx and text.find(table_jsx) + len(table_jsx)
        if not pag_m:
            end = text.find(table_jsx) + len(table_jsx)
        text = text[:start] + new_block + "\n\n" + text[end:]

    path.write_text(text, encoding="utf-8")
    print("ok", cfg["file"])


def main():
    cil = ROOT / "CheckInLogs/index.jsx"
    cil.write_text(process_checkin_logs(cil.read_text(encoding="utf-8")), encoding="utf-8")
    print("ok CheckInLogs/index.jsx")

    for cfg in PAGES:
        process_page(cfg)


if __name__ == "__main__":
    main()
