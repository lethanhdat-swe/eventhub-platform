import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useAIModels from '@/hooks/useAIModels';
import { cn } from '@/lib/utils';

function ModelOptionRow({ ai, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted',
        isSelected && 'bg-muted'
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${ai.color}`}
        >
          {ai.initials}
        </div>

        <span className="capitalize">{ai.provider}</span>

        <span className="truncate text-xs text-gray-600">— {ai.model}</span>
      </div>

      {isSelected ? <Check className="h-4 w-4 shrink-0 text-emerald-500" /> : null}
    </button>
  );
}

function SelectedModelDisplay({ model }) {
  if (!model) return null;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white ${model.color}`}
      >
        {model.initials}
      </div>

      <span className="capitalize">{model.provider}</span>

      <span className="truncate text-xs text-gray-600">— {model.model}</span>
    </div>
  );
}

export default function AIModelCard({ selectedAI, setSelectedAI, content }) {
  const { models, loading } = useAIModels();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedModel = models.find((m) => m.id === selectedAI);

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return models;

    return models.filter((ai) => {
      const haystack = `${ai.id} ${ai.provider} ${ai.model}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [models, searchQuery]);

  const handleSelect = (modelId) => {
    setSelectedAI(modelId);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          🤖
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            Chọn mô hình AI để tạo {content}
          </p>

          <p className="mt-0.5 text-xs text-gray-600">
            Mô hình dùng cho {content}
          </p>
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-between px-3 font-normal"
              disabled={loading}
            />
          }
        >
          <span
            className={cn(
              'min-w-0 truncate',
              !selectedModel && 'text-gray-600'
            )}
          >
            {loading ? (
              'Đang tải models...'
            ) : selectedModel ? (
              <SelectedModelDisplay model={selectedModel} />
            ) : (
              'Chọn mô hình AI'
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-gray-600" />
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[var(--anchor-width)] p-0">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-gray-600" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm mô hình..."
                className="h-8 pl-8"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {loading ? (
              <div className="flex items-center gap-2 px-2 py-3 text-sm text-gray-600">
                <Loader2 className="size-4 animate-spin" />
                Đang tải models...
              </div>
            ) : filteredModels.length === 0 ? (
              <p className="px-2 py-3 text-sm text-gray-600">
                Không tìm thấy mô hình
              </p>
            ) : (
              filteredModels.map((ai) => (
                <ModelOptionRow
                  key={ai.id}
                  ai={ai}
                  isSelected={ai.id === selectedAI}
                  onSelect={() => handleSelect(ai.id)}
                />
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
