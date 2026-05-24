import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getErrorMessage } from '@/lib/http/apiError';
import { orderService } from '@/lib/services/admin/orderService';
import { cn } from '@/lib/utils';
import { formatPriceVnd } from '@/pages/(admin)/PaymentTransactions/data';

const ORDER_SEARCH_LIMIT = 8;

function formatOrderOption(order) {
  return [
    order.orderCode,
    order.customerName ?? '—',
    formatPriceVnd(order.totalAmount).replace(/\s?₫$/, 'đ'),
  ].join(' - ');
}

function ManualConfirmPaymentDialog({
  open,
  transaction,
  submitting = false,
  error,
  onConfirm,
  onCancel,
}) {
  const [orderCode, setOrderCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setOrderCode('');
      setSearchInput(transaction?.orderCode ?? '');
      setDebouncedSearch(transaction?.orderCode ?? '');
      setSelectedOrder(null);
      setOrders([]);
      setOrdersError(null);
      setComboboxOpen(false);
    }
  }, [open, transaction]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!open) return;

    let active = true;

    const loadPendingOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const payload = await orderService.list({
          page: 1,
          limit: ORDER_SEARCH_LIMIT,
          status: 'PENDING',
          search: debouncedSearch,
        });
        if (!active) return;
        setOrders(payload.data ?? []);
      } catch (e) {
        if (!active) return;
        setOrders([]);
        setOrdersError(getErrorMessage(e));
      } finally {
        if (active) setOrdersLoading(false);
      }
    };

    void loadPendingOrders();

    return () => {
      active = false;
    };
  }, [open, debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setSelectedOrder(null);
    setOrderCode('');
    setComboboxOpen(true);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setOrderCode(order.orderCode);
    setSearchInput(order.orderCode);
    setComboboxOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedOrderCode = orderCode.trim();
    if (!trimmedOrderCode || submitting) return;
    onConfirm(trimmedOrderCode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md" showCloseButton={!submitting}>
        <DialogHeader>
          <DialogTitle>Xác nhận giao dịch thủ công</DialogTitle>
          <DialogDescription>
            Nhập mã đơn hàng cần khớp với giao dịch SePay này.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="manual-confirm-order-code">Mã đơn hàng</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id="manual-confirm-order-code"
                    type="button"
                    variant="outline"
                    className="h-9 w-full justify-between px-3 font-normal"
                    disabled={submitting}
                  />
                }
              >
                <span
                  className={cn(
                    'truncate',
                    !selectedOrder && 'text-muted-foreground'
                  )}
                >
                  {selectedOrder
                    ? formatOrderOption(selectedOrder)
                    : 'Chọn đơn hàng đang chờ thanh toán'}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-[min(100vw-2rem,28rem)] p-0"
              >
                <div className="border-b border-border p-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchInput}
                      onChange={(event) =>
                        handleSearchChange(event.target.value)
                      }
                      placeholder="Dán mã đơn hoặc tìm khách hàng..."
                      className="h-8 pl-8"
                      disabled={submitting}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto p-1">
                  {ordersLoading ? (
                    <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Đang tìm đơn hàng...
                    </div>
                  ) : ordersError ? (
                    <p className="px-2 py-3 text-sm text-destructive">
                      {ordersError}
                    </p>
                  ) : orders.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-muted-foreground">
                      Không tìm thấy đơn hàng
                    </p>
                  ) : (
                    orders.map((order) => {
                      const active = order.orderCode === orderCode;

                      return (
                        <button
                          key={order.id}
                          type="button"
                          className={cn(
                            'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                            active && 'bg-accent text-accent-foreground'
                          )}
                          onClick={() => handleSelectOrder(order)}
                        >
                          <Check
                            className={cn(
                              'size-4 shrink-0',
                              active ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {formatOrderOption(order)}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Chỉ hiển thị đơn hàng trạng thái PENDING. Có thể dán mã đơn để
              lọc nhanh.
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter className="mx-0 mb-0 border-t-0 bg-transparent p-0">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting || ordersLoading || !orderCode.trim()}
            >
              {submitting ? 'Đang xác nhận...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ManualConfirmPaymentDialog;
