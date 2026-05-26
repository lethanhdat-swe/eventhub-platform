import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const INITIAL_DATA = [
  {
    id: 1,
    title: "Blog AI Event",
    description: "Tạo bài blog cho sự kiện âm nhạc",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Landing Page",
    description: "Sinh nội dung landing page",
    status: "USED",
  },
  {
    id: 3,
    title: "Email Campaign",
    description: "Viết email marketing",
    status: "FAILED",
  },
];

const STATUS_STYLES = {
  PENDING:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  USED:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",

  FAILED:
    "bg-red-100 text-red-700 border border-red-200",
};

function StatusBadge({ status }) {
  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
      ${STATUS_STYLES[status]}`}
    >
      {status}
    </div>
  );
}

function StatusTable() {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>

            <TableHead>Description</TableHead>

            <TableHead className="w-[180px]">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {INITIAL_DATA.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-gray-900">
                {row.title}
              </TableCell>

              <TableCell className="text-gray-500">
                {row.description}
              </TableCell>

              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default StatusTable;