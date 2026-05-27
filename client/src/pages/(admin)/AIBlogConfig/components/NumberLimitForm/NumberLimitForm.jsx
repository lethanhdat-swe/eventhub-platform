import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function NumberLimitForm({
  onSubmit,
}) {
  const [value, setValue] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const number = Number(
      e.target.value
    );

    if (number > 100) {
      setValue(100);
      return;
    }

    if (number < 1) {
      setValue(1);
      return;
    }

    setValue(number);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onSubmit?.(value);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-end gap-3">
        <div className="w-32">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Số lượng
          </label>

          <Input
            type="number"
            min={1}
            max={100}
            value={value}
            onChange={handleChange}
            placeholder="1 - 100"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Đang tạo..."
            : "Tạo AI Idea"}
        </Button>
      </div>
    </div>
  );
}

export default NumberLimitForm;