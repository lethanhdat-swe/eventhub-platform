import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';

function AdminLoadingState({ rows = 6, columns = 6, minWidth, className }) {
  return (
    <AdminTableWrapper className={className}>
      <Table className={cn(minWidth)}>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="px-2 h-9">
                <Skeleton className="w-full h-4 max-w-30" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-transparent">
              {Array.from({ length: columns }).map((__, colIndex) => (
                <TableCell key={colIndex} className="px-2 py-2">
                  <Skeleton className="w-full h-4" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminTableWrapper>
  );
}

export default AdminLoadingState;
