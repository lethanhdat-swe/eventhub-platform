import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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

function StatusTable({
  data = [],
}) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>

            <TableHead>Description</TableHead>

            <TableHead>Created At</TableHead>

            <TableHead className="w-[180px]">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-gray-900 max-w-[250px]">
                  <div className="line-clamp-2">
                    {row.title}
                  </div>
                </TableCell>

                <TableCell className="text-gray-500 max-w-[500px]">
                  <div className="line-clamp-2">
                    {row.description}
                  </div>
                </TableCell>

                <TableCell className="text-gray-500 whitespace-nowrap">
                  {new Date(
                    row.createdAt
                  ).toLocaleDateString("vi-VN")}
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={row.status}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-32 text-center text-gray-400"
              >
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default StatusTable;