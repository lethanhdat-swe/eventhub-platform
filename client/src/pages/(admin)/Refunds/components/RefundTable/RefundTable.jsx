import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminTableWrapper from '@/pages/(admin)/components/table/AdminTableWrapper';
import {
    formatCurrency,
    formatDateTime,
} from '@/pages/(admin)/Refunds/data';
import RefundStatusBadge from '../RefundStatusBadge/RefundStatusBadge';

function RefundTable({ refunds, onViewDetail }) {
    return (
        <AdminTableWrapper>
            <Table className="min-w-295">
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="px-2 h-9 w-35">
                            Mã đơn
                        </TableHead>
                        <TableHead className="px-2 h-9 min-w-30">
                            Khách hàng
                        </TableHead>
                        <TableHead className="px-2 h-9 min-w-40">
                            Email
                        </TableHead>
                        <TableHead className="px-2 h-9 w-30">
                            Số điện thoại
                        </TableHead>
                        <TableHead className="px-2 h-9 min-w-35">
                            Ngân hàng
                        </TableHead>
                        <TableHead className="h-9 w-27.5 px-2">
                            Hoàn tiền
                        </TableHead>
                        <TableHead className="px-2 h-9 w-25">
                            Trạng thái
                        </TableHead>
                        <TableHead className="h-9 w-32.5 px-2">
                            Ngày tạo
                        </TableHead>
                        <TableHead className="h-9 w-27.5 px-2 text-right">
                            Hành động
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {refunds.map((refund) => (
                        <TableRow key={refund.id}>
                            <TableCell className="px-2 py-1.5 font-medium tabular-nums">
                                {refund.orderCode}
                            </TableCell>

                            <TableCell className="max-w-35 truncate px-2 py-1.5">
                                {refund.customerName}
                            </TableCell>

                            <TableCell
                                className="max-w-45 truncate px-2 py-1.5 text-muted-foreground"
                                title={refund.customerEmail}
                            >
                                {refund.customerEmail}
                            </TableCell>

                            <TableCell className="whitespace-nowrap px-2 py-1.5 tabular-nums text-muted-foreground">
                                {refund.customerPhone}
                            </TableCell>

                            <TableCell className="px-2 py-1.5">
                                <div className="min-w-0">
                                    <p className="font-medium truncate">
                                        {refund.bankName}
                                    </p>
                                    <p
                                        className="text-xs truncate text-muted-foreground tabular-nums"
                                        title={refund.bankAccountNumber}
                                    >
                                        {refund.bankAccountNumber}
                                    </p>
                                </div>
                            </TableCell>

                            <TableCell className="whitespace-nowrap px-2 py-1.5">
                                <span className="font-medium">
                                    {formatCurrency(refund.refundAmount)}
                                </span>
                                <span className="ml-1 text-xs text-muted-foreground">
                                    ({refund.refundPercent}%)
                                </span>
                            </TableCell>

                            <TableCell className="px-2 py-1.5">
                                <RefundStatusBadge status={refund.status} />
                            </TableCell>

                            <TableCell className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                                {formatDateTime(refund.createdAt)}
                            </TableCell>

                            <TableCell className="px-2 py-1.5 text-right">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 px-2 text-xs h-7"
                                    onClick={() => onViewDetail(refund)}
                                >
                                    <Eye className="size-3.5" />
                                    Xem chi tiết
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </AdminTableWrapper>
    );
}

export default RefundTable;
